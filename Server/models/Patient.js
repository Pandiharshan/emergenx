// Updated: 2025-12-19 12:06:16 - feat: fix patient UI components
// Updated: 2025-12-19 12:05:53 - style(ui): fix dashboard
// Updated: 2025-12-19 12:05:43 - feat: implement validation patient form
// Updated: 2025-12-19 12:05:33 - refactor: add auth error handling
// Updated: 2025-12-19 12:05:29 - style(validation): add validation UI components
// Updated: 2025-12-19 12:05:22 - chore(api): fix api API endpoints (fixes #41)
// Updated: 2025-12-19 12:05:18 - style(ui): fix triage system (fixes #36)
// Updated: 2025-12-19 12:04:57 - fix(database): fix patient form in database
// Updated: 2025-12-19 12:04:46 - docs(auth): refactor triage system in auth (fixes #15)
// Updated: 2025-12-19 12:04:37 - chore: fix api error handling
// Updated: 2025-12-19 12:04:19 - refactor(api): update API endpoints
// Updated: 2025-12-19 12:03:56 - test(patient): implement dashboard in patient
// Updated: 2025-12-19 12:03:52 - feat(triage): refactor triage patient form (fixes #32)
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













