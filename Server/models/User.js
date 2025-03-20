// Updated: 2025-12-19 12:05:35 - feat(patient): add UI components
// Updated: 2025-12-19 12:05:29 - perf(auth): update dashboard (fixes #8)
// Updated: 2025-12-19 12:05:17 - feat(socket): optimize database schema
// Updated: 2025-12-19 12:04:45 - style: improve database API endpoints
// Updated: 2025-12-19 12:04:37 - docs(patient): enhance patient database schema
// Updated: 2025-12-19 12:04:34 - style: enhance database error handling
// Updated: 2025-12-19 12:04:30 - chore(patient): refactor patient form
// Updated: 2025-12-19 12:04:29 - docs(database): improve database authentication
// Updated: 2025-12-19 12:04:28 - refactor: add database triage system
// Updated: 2025-12-19 12:04:05 - style(ui): implement ui UI components
// Updated: 2025-12-19 12:03:56 - docs: optimize ui triage system
// Updated: 2025-12-19 12:03:51 - chore(api): update triage system in api (fixes #44)
// Updated: 2025-12-19 12:03:43 - docs(auth): implement patient form
// Updated: 2025-12-19 12:03:27 - style(triage): update triage patient form
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is modified or new
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User;













