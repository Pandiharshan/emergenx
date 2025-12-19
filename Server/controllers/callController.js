import Call from '../models/Call.js';
import Contact from '../models/Contact.js';
import User from '../models/User.js';

// @desc    Initiate a new call
// @route   POST /api/calls/initiate
// @access  Private
const initiateCall = async (req, res) => {
  try {
    const { receiverId, callType = 'voice', isEmergency = false, location, symptoms } = req.body;

    // Validate receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: 'Receiver not found'
      });
    }

    // Prevent calling yourself
    if (req.user.id === receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot call yourself'
      });
    }

    // Create new call record
    const call = await Call.create({
      caller: req.user.id,
      receiver: receiverId,
      callType,
      isEmergency,
      emergencyLevel: isEmergency ? 'high' : 'low',
      location,
      symptoms,
      status: 'initiated'
    });

    // Populate caller and receiver details
    await call.populate('caller', 'name email');
    await call.populate('receiver', 'name email');

    res.status(201).json({
      success: true,
      message: 'Call initiated successfully',
      data: call
    });

  } catch (error) {
    console.error('Initiate call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during call initiation'
    });
  }
};

// @desc    Answer an incoming call
// @route   PUT /api/calls/:callId/answer
// @access  Private
const answerCall = async (req, res) => {
  try {
    const call = await Call.findById(req.params.callId);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    // Only receiver can answer the call
    if (call.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to answer this call'
      });
    }

    // Update call status
    call.status = 'answered';
    call.startTime = new Date();
    await call.save();

    await call.populate('caller', 'name email');
    await call.populate('receiver', 'name email');

    res.status(200).json({
      success: true,
      message: 'Call answered successfully',
      data: call
    });

  } catch (error) {
    console.error('Answer call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while answering call'
    });
  }
};

// @desc    End a call
// @route   PUT /api/calls/:callId/end
// @access  Private
const endCall = async (req, res) => {
  try {
    const { notes } = req.body;
    const call = await Call.findById(req.params.callId);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    // Only caller or receiver can end the call
    if (call.caller.toString() !== req.user.id && call.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to end this call'
      });
    }

    // End the call
    await call.endCall();
    if (notes) {
      call.notes = notes;
      await call.save();
    }

    await call.populate('caller', 'name email');
    await call.populate('receiver', 'name email');

    res.status(200).json({
      success: true,
      message: 'Call ended successfully',
      data: call
    });

  } catch (error) {
    console.error('End call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while ending call'
    });
  }
};

// @desc    Reject a call
// @route   PUT /api/calls/:callId/reject
// @access  Private
const rejectCall = async (req, res) => {
  try {
    const call = await Call.findById(req.params.callId);

    if (!call) {
      return res.status(404).json({
        success: false,
        message: 'Call not found'
      });
    }

    // Only receiver can reject the call
    if (call.receiver.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to reject this call'
      });
    }

    // Update call status
    call.status = 'rejected';
    call.endTime = new Date();
    await call.save();

    await call.populate('caller', 'name email');
    await call.populate('receiver', 'name email');

    res.status(200).json({
      success: true,
      message: 'Call rejected successfully',
      data: call
    });

  } catch (error) {
    console.error('Reject call error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while rejecting call'
    });
  }
};

// @desc    Get call history
// @route   GET /api/calls/history
// @access  Private
const getCallHistory = async (req, res) => {
  try {
    const { page = 1, limit = 20, type = 'all' } = req.query;
    const skip = (page - 1) * limit;

    let query = {
      $or: [
        { caller: req.user.id },
        { receiver: req.user.id }
      ]
    };

    // Filter by call type if specified
    if (type !== 'all') {
      if (type === 'missed') {
        query.status = 'missed';
        query.receiver = req.user.id;
      } else if (type === 'outgoing') {
        query.caller = req.user.id;
      } else if (type === 'incoming') {
        query.receiver = req.user.id;
      } else if (type === 'emergency') {
        query.isEmergency = true;
      }
    }

    const calls = await Call.find(query)
      .populate('caller', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Call.countDocuments(query);

    res.status(200).json({
      success: true,
      message: 'Call history retrieved successfully',
      data: {
        calls,
        pagination: {
          current: parseInt(page),
          total: Math.ceil(total / limit),
          count: calls.length,
          totalCalls: total
        }
      }
    });

  } catch (error) {
    console.error('Get call history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving call history'
    });
  }
};

// @desc    Get active calls
// @route   GET /api/calls/active
// @access  Private
const getActiveCalls = async (req, res) => {
  try {
    const activeCalls = await Call.find({
      $or: [
        { caller: req.user.id },
        { receiver: req.user.id }
      ],
      status: { $in: ['initiated', 'ringing', 'answered'] }
    })
    .populate('caller', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: 'Active calls retrieved successfully',
      data: activeCalls
    });

  } catch (error) {
    console.error('Get active calls error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving active calls'
    });
  }
};

// @desc    Add contact
// @route   POST /api/calls/contacts
// @access  Private
const addContact = async (req, res) => {
  try {
    const { contactUserId, contactName, contactPhone, contactEmail, relationship, isEmergencyContact } = req.body;

    // Validate required fields
    if (!contactUserId || !contactName || !contactPhone) {
      return res.status(400).json({
        success: false,
        message: 'Contact user ID, name, and phone are required'
      });
    }

    // Check if contact user exists
    const contactUser = await User.findById(contactUserId);
    if (!contactUser) {
      return res.status(404).json({
        success: false,
        message: 'Contact user not found'
      });
    }

    // Check if contact already exists
    const existingContact = await Contact.findOne({
      user: req.user.id,
      contactUser: contactUserId
    });

    if (existingContact) {
      return res.status(400).json({
        success: false,
        message: 'Contact already exists'
      });
    }

    // Create new contact
    const contact = await Contact.create({
      user: req.user.id,
      contactUser: contactUserId,
      contactName,
      contactPhone,
      contactEmail,
      relationship,
      isEmergencyContact
    });

    await contact.populate('contactUser', 'name email');

    res.status(201).json({
      success: true,
      message: 'Contact added successfully',
      data: contact
    });

  } catch (error) {
    console.error('Add contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while adding contact'
    });
  }
};

// @desc    Get contacts
// @route   GET /api/calls/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    const { emergency = false } = req.query;

    let query = { user: req.user.id, isBlocked: false };
    
    if (emergency === 'true') {
      query.isEmergencyContact = true;
    }

    const contacts = await Contact.find(query)
      .populate('contactUser', 'name email')
      .sort({ contactName: 1 });

    res.status(200).json({
      success: true,
      message: 'Contacts retrieved successfully',
      data: contacts
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while retrieving contacts'
    });
  }
};

export {
  initiateCall,
  answerCall,
  endCall,
  rejectCall,
  getCallHistory,
  getActiveCalls,
  addContact,
  getContacts
};
