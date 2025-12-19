// Test script to verify EmergenX connections
const mongoose = require('mongoose');

// Test MongoDB connection
async function testMongoConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/emergenx';
    console.log('MongoDB URI:', mongoUri);
    
    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('✅ MongoDB Connected:', conn.connection.host);
    console.log('✅ Database name:', conn.connection.name);
    
    // Test creating a collection
    const testCollection = conn.connection.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Database write test successful');
    
    // Clean up test data
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database cleanup successful');
    
    await mongoose.disconnect();
    console.log('✅ MongoDB connection test completed successfully');
    
  } catch (error) {
    console.error('❌ MongoDB connection test failed:', error.message);
    console.error('Please ensure MongoDB is running on localhost:27017');
  }
}

// Test server endpoints
async function testServerEndpoints() {
  try {
    console.log('\n🔍 Testing server endpoints...');
    
    const baseUrl = 'http://localhost:5000';
    
    // Test health endpoint
    const healthResponse = await fetch(`${baseUrl}/`);
    const healthData = await healthResponse.json();
    console.log('✅ Health endpoint:', healthData);
    
    // Test auth endpoints (without authentication)
    const authResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    
    if (authResponse.ok) {
      console.log('✅ Auth endpoint is accessible');
    } else {
      console.log('⚠️  Auth endpoint returned status:', authResponse.status);
    }
    
  } catch (error) {
    console.error('❌ Server endpoint test failed:', error.message);
    console.error('Please ensure the server is running on port 5000');
  }
}

// Run tests
async function runTests() {
  console.log('🚨 EmergenX Connection Test');
  console.log('============================\n');
  
  await testMongoConnection();
  await testServerEndpoints();
  
  console.log('\n🎉 Connection tests completed!');
}

// Run if this file is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { testMongoConnection, testServerEndpoints }; 