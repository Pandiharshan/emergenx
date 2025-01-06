// Updated: 2025-12-19 12:03:25 - feat(database): improve API endpoints in database
import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
    },
    symptoms: {
      type: [Object],
      required: [true, 'Symptoms are required'],
      validate: {
        validator: function (symptoms) {
          return symptoms.length > 0;
        },
        message: 'At least one symptom must be provided',
      },
    },
    diagnosis: {
      type: String,
      required: [true, 'Diagnosis is required'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for better query performance
patientSchema.index({ user: 1, date: -1 });

const Patient = mongoose.model('Patient', patientSchema);

export default Patient;
