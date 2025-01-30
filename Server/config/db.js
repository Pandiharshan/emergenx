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





