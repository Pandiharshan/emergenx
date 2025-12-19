import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { io } from 'socket.io-client';
import { AuthContext } from './AuthContext';

const CallContext = createContext();

// Call states
const CALL_STATES = {
  IDLE: 'idle',
  INITIATING: 'initiating',
  RINGING: 'ringing',
  INCOMING: 'incoming',
  CONNECTED: 'connected',
  ENDED: 'ended'
};

// Initial state
const initialState = {
  socket: null,
  currentCall: null,
  callState: CALL_STATES.IDLE,
  incomingCall: null,
  contacts: [],
  callHistory: [],
  activeUsers: [],
  localStream: null,
  remoteStream: null,
  peerConnection: null,
  isVideoEnabled: true,
  isAudioEnabled: true
};

// Reducer
const callReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SOCKET':
      return { ...state, socket: action.payload };
    
    case 'SET_CALL_STATE':
      return { ...state, callState: action.payload };
    
    case 'SET_CURRENT_CALL':
      return { ...state, currentCall: action.payload };
    
    case 'SET_INCOMING_CALL':
      return { ...state, incomingCall: action.payload };
    
    case 'SET_CONTACTS':
      return { ...state, contacts: action.payload };
    
    case 'ADD_CONTACT':
      return { ...state, contacts: [...state.contacts, action.payload] };
    
    case 'SET_CALL_HISTORY':
      return { ...state, callHistory: action.payload };
    
    case 'ADD_CALL_TO_HISTORY':
      return { ...state, callHistory: [action.payload, ...state.callHistory] };
    
    case 'SET_LOCAL_STREAM':
      return { ...state, localStream: action.payload };
    
    case 'SET_REMOTE_STREAM':
      return { ...state, remoteStream: action.payload };
    
    case 'SET_PEER_CONNECTION':
      return { ...state, peerConnection: action.payload };
    
    case 'TOGGLE_VIDEO':
      return { ...state, isVideoEnabled: !state.isVideoEnabled };
    
    case 'TOGGLE_AUDIO':
      return { ...state, isAudioEnabled: !state.isAudioEnabled };
    
    case 'RESET_CALL':
      return {
        ...state,
        currentCall: null,
        incomingCall: null,
        callState: CALL_STATES.IDLE,
        localStream: null,
        remoteStream: null,
        peerConnection: null
      };
    
    default:
      return state;
  }
};

export const CallProvider = ({ children }) => {
  const [state, dispatch] = useReducer(callReducer, initialState);
  const { user } = useContext(AuthContext);

  // Initialize socket connection
  useEffect(() => {
    if (user && !state.socket) {
      const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:5000');
      
      socket.on('connect', () => {
        console.log('Connected to server');
        socket.emit('join', user.id);
      });

      // Handle incoming call
      socket.on('incoming-call', (callData) => {
        dispatch({ type: 'SET_INCOMING_CALL', payload: callData });
        dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.INCOMING });
      });

      // Handle call answered
      socket.on('call-answered', (callData) => {
        dispatch({ type: 'SET_CURRENT_CALL', payload: callData });
        dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.CONNECTED });
      });

      // Handle call rejected
      socket.on('call-rejected', (callData) => {
        dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.ENDED });
        dispatch({ type: 'ADD_CALL_TO_HISTORY', payload: callData });
        setTimeout(() => dispatch({ type: 'RESET_CALL' }), 2000);
      });

      // Handle call ended
      socket.on('call-ended', (callData) => {
        dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.ENDED });
        dispatch({ type: 'ADD_CALL_TO_HISTORY', payload: callData });
        cleanupCall();
      });

      // Handle WebRTC signaling
      socket.on('webrtc-offer', async ({ offer, callerId }) => {
        await handleWebRTCOffer(offer, callerId);
      });

      socket.on('webrtc-answer', async ({ answer }) => {
        if (state.peerConnection) {
          await state.peerConnection.setRemoteDescription(answer);
        }
      });

      socket.on('webrtc-ice-candidate', async ({ candidate }) => {
        if (state.peerConnection) {
          await state.peerConnection.addIceCandidate(candidate);
        }
      });

      // Handle emergency alerts
      socket.on('emergency-alert', (alertData) => {
        // Show emergency notification
        showEmergencyNotification(alertData);
      });

      dispatch({ type: 'SET_SOCKET', payload: socket });

      return () => {
        socket.disconnect();
      };
    }
  }, [user]);

  // WebRTC functions
  const createPeerConnection = () => {
    const configuration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    };

    const peerConnection = new RTCPeerConnection(configuration);

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && state.socket) {
        state.socket.emit('webrtc-ice-candidate', {
          targetUserId: state.currentCall?.receiver || state.incomingCall?.caller,
          candidate: event.candidate
        });
      }
    };

    peerConnection.ontrack = (event) => {
      dispatch({ type: 'SET_REMOTE_STREAM', payload: event.streams[0] });
    };

    dispatch({ type: 'SET_PEER_CONNECTION', payload: peerConnection });
    return peerConnection;
  };

  const handleWebRTCOffer = async (offer, callerId) => {
    const peerConnection = createPeerConnection();
    
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, state.localStream);
      });
    }

    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    state.socket.emit('webrtc-answer', {
      callerId,
      answer
    });
  };

  const getMediaStream = async (video = true, audio = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
      dispatch({ type: 'SET_LOCAL_STREAM', payload: stream });
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  const cleanupCall = () => {
    if (state.localStream) {
      state.localStream.getTracks().forEach(track => track.stop());
    }
    if (state.peerConnection) {
      state.peerConnection.close();
    }
    setTimeout(() => dispatch({ type: 'RESET_CALL' }), 2000);
  };

  // Call functions
  const initiateCall = async (receiverId, callType = 'voice', isEmergency = false) => {
    try {
      dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.INITIATING });

      // Get media stream
      const stream = await getMediaStream(callType === 'video', true);
      
      // Create call data
      const callData = {
        receiver: receiverId,
        callType,
        isEmergency,
        startTime: new Date()
      };

      // Create peer connection
      const peerConnection = createPeerConnection();
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);

      // Send call initiation through socket
      state.socket.emit('initiate-call', {
        receiverId,
        callData: {
          ...callData,
          offer
        }
      });

      dispatch({ type: 'SET_CURRENT_CALL', payload: callData });
      dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.RINGING });

    } catch (error) {
      console.error('Error initiating call:', error);
      dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.IDLE });
    }
  };

  const answerCall = async () => {
    try {
      if (!state.incomingCall) return;

      // Get media stream
      const stream = await getMediaStream(
        state.incomingCall.callType === 'video', 
        true
      );

      // Notify caller that call is answered
      state.socket.emit('answer-call', {
        callerId: state.incomingCall.callerId,
        callData: state.incomingCall
      });

      dispatch({ type: 'SET_CURRENT_CALL', payload: state.incomingCall });
      dispatch({ type: 'SET_INCOMING_CALL', payload: null });
      dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.CONNECTED });

    } catch (error) {
      console.error('Error answering call:', error);
    }
  };

  const rejectCall = () => {
    if (!state.incomingCall) return;

    state.socket.emit('reject-call', {
      callerId: state.incomingCall.callerId,
      callData: state.incomingCall
    });

    dispatch({ type: 'SET_INCOMING_CALL', payload: null });
    dispatch({ type: 'SET_CALL_STATE', payload: CALL_STATES.IDLE });
  };

  const endCall = () => {
    const otherUserId = state.currentCall?.receiver || state.incomingCall?.callerId;
    
    if (otherUserId) {
      state.socket.emit('end-call', {
        otherUserId,
        callData: state.currentCall || state.incomingCall
      });
    }

    cleanupCall();
  };

  const toggleVideo = () => {
    if (state.localStream) {
      const videoTrack = state.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !state.isVideoEnabled;
        dispatch({ type: 'TOGGLE_VIDEO' });
      }
    }
  };

  const toggleAudio = () => {
    if (state.localStream) {
      const audioTrack = state.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !state.isAudioEnabled;
        dispatch({ type: 'TOGGLE_AUDIO' });
      }
    }
  };

  const showEmergencyNotification = (alertData) => {
    // This would show a browser notification or in-app alert
    if (Notification.permission === 'granted') {
      new Notification('Emergency Call Alert', {
        body: `Emergency call from ${alertData.callerName || 'Unknown'}`,
        icon: '/emergency-icon.png'
      });
    }
  };

  const value = {
    ...state,
    CALL_STATES,
    initiateCall,
    answerCall,
    rejectCall,
    endCall,
    toggleVideo,
    toggleAudio,
    getMediaStream,
    dispatch
  };

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

export { CallContext };
