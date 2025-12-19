import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  contactName: {
    type: String,
    required: true
  },
  contactPhone: {
    type: String,
    required: true
  },
  contactEmail: {
    type: String
  },
  relationship: {
    type: String,
    enum: ['family', 'friend', 'doctor', 'emergency', 'colleague', 'other'],
    default: 'other'
  },
  isEmergencyContact: {
    type: Boolean,
    default: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  lastCallDate: {
    type: Date
  },
  callCount: {
    type: Number,
    default: 0
  },
  notes: {
    type: String,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for efficient queries
contactSchema.index({ user: 1, contactName: 1 });
contactSchema.index({ user: 1, isEmergencyContact: 1 });
contactSchema.index({ contactPhone: 1 });

// Prevent duplicate contacts for same user
contactSchema.index({ user: 1, contactUser: 1 }, { unique: true });

export default mongoose.model('Contact', contactSchema);
