import React, { useState, useEffect } from 'react';
import { useCall } from '../context/CallContext';
import ContactList from '../components/ContactList';
import { Phone, Video, Clock, PhoneIncoming, PhoneOutgoing, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import './Calls.css';

const Calls = () => {
  const { callHistory, dispatch } = useCall();
  const [activeTab, setActiveTab] = useState('contacts');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'history') {
      fetchCallHistory();
    }
  }, [activeTab]);

  const fetchCallHistory = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/calls/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data.data.calls);
    } catch (error) {
      console.error('Error fetching call history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCallDuration = (duration) => {
    if (!duration) return '0s';
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  const formatCallTime = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const getCallIcon = (call, userId) => {
    if (call.isEmergency) {
      return <AlertTriangle size={20} className="emergency-icon" />;
    }
    
    if (call.caller._id === userId) {
      return <PhoneOutgoing size={20} className="outgoing-icon" />;
    } else {
      return <PhoneIncoming size={20} className="incoming-icon" />;
    }
  };

  const getCallStatus = (call) => {
    switch (call.status) {
      case 'answered':
      case 'ended':
        return 'completed';
      case 'missed':
        return 'missed';
      case 'rejected':
        return 'rejected';
      default:
        return call.status;
    }
  };

  const renderCallHistory = () => {
    if (loading) {
      return <div className="loading">Loading call history...</div>;
    }

    if (history.length === 0) {
      return (
        <div className="no-history">
          <Clock size={48} />
          <p>No call history yet</p>
          <p className="subtitle">Your calls will appear here</p>
        </div>
      );
    }

    const userId = JSON.parse(localStorage.getItem('user'))?.id;

    return (
      <div className="call-history">
        {history.map(call => {
          const isOutgoing = call.caller._id === userId;
          const otherUser = isOutgoing ? call.receiver : call.caller;
          
          return (
            <div key={call._id} className={`call-history-item ${getCallStatus(call)}`}>
              <div className="call-info">
                <div className="call-icon">
                  {getCallIcon(call, userId)}
                </div>
                <div className="call-details">
                  <h4>{otherUser.name}</h4>
                  <p className="call-meta">
                    {call.callType === 'video' ? 'Video call' : 'Voice call'}
                    {call.isEmergency && <span className="emergency-badge">Emergency</span>}
                  </p>
                  <p className="call-time">{formatCallTime(call.createdAt)}</p>
                </div>
              </div>
              
              <div className="call-stats">
                <span className={`call-status ${getCallStatus(call)}`}>
                  {call.status}
                </span>
                {call.duration > 0 && (
                  <span className="call-duration">
                    {formatCallDuration(call.duration)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="calls-page">
      <div className="calls-header">
        <h1>Calls</h1>
        <div className="tab-navigation">
          <button
            className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            <Phone size={18} />
            Contacts
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <Clock size={18} />
            History
          </button>
        </div>
      </div>

      <div className="calls-content">
        {activeTab === 'contacts' && <ContactList />}
        {activeTab === 'history' && renderCallHistory()}
      </div>
    </div>
  );
};

export default Calls;
