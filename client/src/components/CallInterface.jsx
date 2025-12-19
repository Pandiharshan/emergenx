import React, { useRef, useEffect } from 'react';
import { useCall } from '../context/CallContext';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Users } from 'lucide-react';
import './CallInterface.css';

const CallInterface = () => {
  const {
    callState,
    currentCall,
    incomingCall,
    localStream,
    remoteStream,
    isVideoEnabled,
    isAudioEnabled,
    CALL_STATES,
    answerCall,
    rejectCall,
    endCall,
    toggleVideo,
    toggleAudio
  } = useCall();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Set up video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Don't render if no active call
  if (callState === CALL_STATES.IDLE) {
    return null;
  }

  const renderIncomingCall = () => (
    <div className="call-interface incoming-call">
      <div className="call-info">
        <div className="caller-avatar">
          <Users size={48} />
        </div>
        <h3>{incomingCall?.callerName || 'Unknown Caller'}</h3>
        <p className="call-type">
          {incomingCall?.callType === 'video' ? 'Video Call' : 'Voice Call'}
          {incomingCall?.isEmergency && <span className="emergency-badge">EMERGENCY</span>}
        </p>
      </div>
      
      <div className="call-actions">
        <button 
          className="call-btn answer-btn"
          onClick={answerCall}
          aria-label="Answer call"
        >
          <Phone size={24} />
        </button>
        <button 
          className="call-btn reject-btn"
          onClick={rejectCall}
          aria-label="Reject call"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  );

  const renderActiveCall = () => (
    <div className="call-interface active-call">
      <div className="video-container">
        {/* Remote video */}
        <div className="remote-video">
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="video-stream remote"
          />
          {!remoteStream && (
            <div className="no-video-placeholder">
              <Users size={64} />
              <p>{currentCall?.receiverName || 'Connecting...'}</p>
            </div>
          )}
        </div>

        {/* Local video */}
        {(currentCall?.callType === 'video' || incomingCall?.callType === 'video') && (
          <div className="local-video">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={`video-stream local ${!isVideoEnabled ? 'video-disabled' : ''}`}
            />
            {!isVideoEnabled && (
              <div className="video-disabled-overlay">
                <VideoOff size={24} />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="call-controls">
        <div className="control-buttons">
          {/* Audio toggle */}
          <button
            className={`control-btn ${!isAudioEnabled ? 'disabled' : ''}`}
            onClick={toggleAudio}
            aria-label={isAudioEnabled ? 'Mute' : 'Unmute'}
          >
            {isAudioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
          </button>

          {/* Video toggle (only for video calls) */}
          {(currentCall?.callType === 'video' || incomingCall?.callType === 'video') && (
            <button
              className={`control-btn ${!isVideoEnabled ? 'disabled' : ''}`}
              onClick={toggleVideo}
              aria-label={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? <Video size={20} /> : <VideoOff size={20} />}
            </button>
          )}

          {/* End call */}
          <button
            className="control-btn end-call-btn"
            onClick={endCall}
            aria-label="End call"
          >
            <PhoneOff size={20} />
          </button>
        </div>

        <div className="call-info-bar">
          <span className="call-status">
            {callState === CALL_STATES.RINGING && 'Calling...'}
            {callState === CALL_STATES.CONNECTED && 'Connected'}
            {callState === CALL_STATES.ENDED && 'Call Ended'}
          </span>
          {currentCall?.isEmergency && (
            <span className="emergency-indicator">EMERGENCY CALL</span>
          )}
        </div>
      </div>
    </div>
  );

  const renderCallStatus = () => (
    <div className="call-interface call-status">
      <div className="status-info">
        <div className="status-icon">
          {callState === CALL_STATES.INITIATING && <Phone className="pulse" size={32} />}
          {callState === CALL_STATES.RINGING && <Phone className="ring" size={32} />}
          {callState === CALL_STATES.ENDED && <PhoneOff size={32} />}
        </div>
        <p className="status-text">
          {callState === CALL_STATES.INITIATING && 'Initiating call...'}
          {callState === CALL_STATES.RINGING && 'Ringing...'}
          {callState === CALL_STATES.ENDED && 'Call ended'}
        </p>
      </div>
      
      {(callState === CALL_STATES.RINGING || callState === CALL_STATES.INITIATING) && (
        <button className="call-btn end-call-btn" onClick={endCall}>
          <PhoneOff size={20} />
          Cancel
        </button>
      )}
    </div>
  );

  return (
    <div className="call-overlay">
      {callState === CALL_STATES.INCOMING && renderIncomingCall()}
      {callState === CALL_STATES.CONNECTED && renderActiveCall()}
      {(callState === CALL_STATES.INITIATING || 
        callState === CALL_STATES.RINGING || 
        callState === CALL_STATES.ENDED) && renderCallStatus()}
    </div>
  );
};

export default CallInterface;
