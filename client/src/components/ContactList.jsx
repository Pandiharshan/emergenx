import React, { useState, useEffect } from 'react';
import { useCall } from '../context/CallContext';
import { Phone, Video, UserPlus, Search, Users, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import './ContactList.css';

const ContactList = () => {
  const { initiateCall } = useCall();
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [newContact, setNewContact] = useState({
    contactUserId: '',
    contactName: '',
    contactPhone: '',
    contactEmail: '',
    relationship: 'other',
    isEmergencyContact: false
  });

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/calls/contacts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(response.data.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('/api/calls/contacts', newContact, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setContacts([...contacts, response.data.data]);
      setNewContact({
        contactUserId: '',
        contactName: '',
        contactPhone: '',
        contactEmail: '',
        relationship: 'other',
        isEmergencyContact: false
      });
      setShowAddContact(false);
    } catch (error) {
      console.error('Error adding contact:', error);
    }
  };

  const handleCall = (contact, callType = 'voice', isEmergency = false) => {
    initiateCall(contact.contactUser._id, callType, isEmergency);
  };

  const filteredContacts = contacts.filter(contact =>
    contact.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.contactPhone.includes(searchTerm)
  );

  const emergencyContacts = filteredContacts.filter(contact => contact.isEmergencyContact);
  const regularContacts = filteredContacts.filter(contact => !contact.isEmergencyContact);

  if (loading) {
    return (
      <div className="contact-list-container">
        <div className="loading">Loading contacts...</div>
      </div>
    );
  }

  return (
    <div className="contact-list-container">
      <div className="contact-list-header">
        <h2>Contacts</h2>
        <button 
          className="add-contact-btn"
          onClick={() => setShowAddContact(true)}
        >
          <UserPlus size={20} />
          Add Contact
        </button>
      </div>

      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Emergency Contacts */}
      {emergencyContacts.length > 0 && (
        <div className="contact-section">
          <h3 className="section-title emergency">
            <AlertTriangle size={18} />
            Emergency Contacts
          </h3>
          <div className="contact-grid">
            {emergencyContacts.map(contact => (
              <ContactCard 
                key={contact._id} 
                contact={contact} 
                onCall={handleCall}
                isEmergency={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Regular Contacts */}
      {regularContacts.length > 0 && (
        <div className="contact-section">
          <h3 className="section-title">
            <Users size={18} />
            All Contacts
          </h3>
          <div className="contact-grid">
            {regularContacts.map(contact => (
              <ContactCard 
                key={contact._id} 
                contact={contact} 
                onCall={handleCall}
              />
            ))}
          </div>
        </div>
      )}

      {filteredContacts.length === 0 && (
        <div className="no-contacts">
          <Users size={48} />
          <p>No contacts found</p>
          <button 
            className="add-first-contact-btn"
            onClick={() => setShowAddContact(true)}
          >
            Add your first contact
          </button>
        </div>
      )}

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add New Contact</h3>
            <form onSubmit={handleAddContact}>
              <div className="form-group">
                <label>Contact Name *</label>
                <input
                  type="text"
                  required
                  value={newContact.contactName}
                  onChange={(e) => setNewContact({...newContact, contactName: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  required
                  value={newContact.contactPhone}
                  onChange={(e) => setNewContact({...newContact, contactPhone: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={newContact.contactEmail}
                  onChange={(e) => setNewContact({...newContact, contactEmail: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>User ID *</label>
                <input
                  type="text"
                  required
                  placeholder="EmergenX User ID"
                  value={newContact.contactUserId}
                  onChange={(e) => setNewContact({...newContact, contactUserId: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Relationship</label>
                <select
                  value={newContact.relationship}
                  onChange={(e) => setNewContact({...newContact, relationship: e.target.value})}
                >
                  <option value="family">Family</option>
                  <option value="friend">Friend</option>
                  <option value="doctor">Doctor</option>
                  <option value="emergency">Emergency Contact</option>
                  <option value="colleague">Colleague</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={newContact.isEmergencyContact}
                    onChange={(e) => setNewContact({...newContact, isEmergencyContact: e.target.checked})}
                  />
                  Emergency Contact
                </label>
              </div>
              
              <div className="modal-actions">
                <button type="button" onClick={() => setShowAddContact(false)}>
                  Cancel
                </button>
                <button type="submit">Add Contact</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ContactCard = ({ contact, onCall, isEmergency = false }) => {
  return (
    <div className={`contact-card ${isEmergency ? 'emergency' : ''}`}>
      <div className="contact-info">
        <div className="contact-avatar">
          <Users size={24} />
        </div>
        <div className="contact-details">
          <h4>{contact.contactName}</h4>
          <p className="contact-phone">{contact.contactPhone}</p>
          <span className="contact-relationship">{contact.relationship}</span>
        </div>
      </div>
      
      <div className="contact-actions">
        <button
          className="call-btn voice-call"
          onClick={() => onCall(contact, 'voice', isEmergency)}
          title="Voice Call"
        >
          <Phone size={18} />
        </button>
        <button
          className="call-btn video-call"
          onClick={() => onCall(contact, 'video', isEmergency)}
          title="Video Call"
        >
          <Video size={18} />
        </button>
        {isEmergency && (
          <button
            className="call-btn emergency-call"
            onClick={() => onCall(contact, 'voice', true)}
            title="Emergency Call"
          >
            <AlertTriangle size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ContactList;
