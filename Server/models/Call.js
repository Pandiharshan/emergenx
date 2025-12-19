import mongoose from 'mongoose';

const callSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  callType: {
    type: String,
    enum: ['voice', 'video', 'emergency'],
    default: 'voice'
  },
  status: {
    type: String,
    enum: ['initiated', 'ringing', 'answered', 'ended', 'missed', 'rejected'],
    default: 'initiated'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  emergencyLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  notes: {
    type: String,
    maxlength: 1000
  },
  recordingUrl: {
    type: String
  },
  isEmergency: {
    type: Boolean,
    default: false
  },
  location: {
    latitude: Number,
    longitude: Number,
    address: String
  },
  symptoms: [{
    name: String,
    severity: {
      type: String,
      enum: ['mild', 'moderate', 'severe'],
      default: 'mild'
    }
  }],
  triageResult: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  }
}, {
  timestamps: true
});

// Index for efficient queries
callSchema.index({ caller: 1, createdAt: -1 });
callSchema.index({ receiver: 1, createdAt: -1 });
callSchema.index({ status: 1 });
callSchema.index({ isEmergency: 1, createdAt: -1 });

// Virtual for call duration in minutes
callSchema.virtual('durationInMinutes').get(function() {
  return Math.round(this.duration / 60);
});

// Method to calculate duration when call ends
callSchema.methods.calculateDuration = function() {
  if (this.endTime && this.startTime) {
    this.duration = Math.floor((this.endTime - this.startTime) / 1000);
  }
  return this.duration;
};

// Method to end call
callSchema.methods.endCall = function() {
  this.endTime = new Date();
  this.status = 'ended';
  this.calculateDuration();
  return this.save();
};

export default mongoose.model('Call', callSchema);
