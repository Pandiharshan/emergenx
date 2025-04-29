// Updated: 2025-12-19 12:06:41 - feat: implement triage API endpoints
// Updated: 2025-12-19 12:06:30 - style(patient): implement patient form in patient
// Updated: 2025-12-19 12:06:18 - refactor: add ui UI components
// Updated: 2025-12-19 12:06:12 - fix(patient): refactor patient patient form
// Updated: 2025-12-19 12:06:09 - style(triage): optimize patient form
// Updated: 2025-12-19 12:06:07 - refactor(database): improve database patient form
// Updated: 2025-12-19 12:06:05 - feat: fix validation authentication
// Updated: 2025-12-19 12:06:02 - style: enhance api API endpoints
// Updated: 2025-12-19 12:05:51 - style: improve triage authentication
// Updated: 2025-12-19 12:05:45 - fix(socket): refactor UI components
// Updated: 2025-12-19 12:05:41 - chore(validation): enhance triage system
// Updated: 2025-12-19 12:05:40 - refactor(triage): refactor triage triage system
// Updated: 2025-12-19 12:05:30 - chore(validation): refactor API endpoints in validation (fixes #4)
// Updated: 2025-12-19 12:05:20 - chore(ui): refactor API endpoints in ui
// Updated: 2025-12-19 12:05:13 - docs(database): add API endpoints
// Updated: 2025-12-19 12:05:07 - style(database): add dashboard
// Updated: 2025-12-19 12:05:04 - test(auth): add API endpoints in auth
// Updated: 2025-12-19 12:04:49 - refactor: update triage patient form
// Updated: 2025-12-19 12:04:44 - refactor(auth): optimize UI components
// Updated: 2025-12-19 12:04:40 - feat(api): enhance error handling in api (fixes #43)
// Updated: 2025-12-19 12:04:34 - test(patient): enhance patient API endpoints
// Updated: 2025-12-19 12:04:25 - test: improve socket API endpoints
// Updated: 2025-12-19 12:04:16 - refactor(database): add authentication in database
// Updated: 2025-12-19 12:04:13 - refactor(patient): add triage system in patient
// Updated: 2025-12-19 12:04:08 - style(ui): refactor UI components in ui (fixes #24)
// Updated: 2025-12-19 12:04:03 - docs(triage): implement database schema in triage
// Updated: 2025-12-19 12:03:55 - docs: update api dashboard
// Updated: 2025-12-19 12:03:27 - style(ui): update database schema
import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Use MONGO_URI for consistency with your setup
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/emergenx';
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`âœ… MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('âŒ MongoDB connection failed:', error.message);
    console.error('Please ensure MongoDB is running and accessible');
    process.exit(1);
  }
};

export default connectDB;




























