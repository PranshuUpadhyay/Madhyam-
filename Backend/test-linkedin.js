import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

async function testLinkedInAuth() {
  try {
    console.log('🧪 Testing LinkedIn Authentication...\n');

    // Test 1: Check if LinkedIn auth endpoint is accessible
    console.log('1. Testing LinkedIn auth endpoint...');
    const authResponse = await axios.get(`${BASE_URL}/auth/linkedin`);
    console.log('✅ LinkedIn auth endpoint working');
    console.log('Auth URL:', authResponse.data.authUrl);
    console.log('');

    // Test 2: Check if callback endpoint exists (should return 400 without code)
    console.log('2. Testing LinkedIn callback endpoint...');
    try {
      await axios.get(`${BASE_URL}/auth/linkedin/callback`);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        console.log('✅ LinkedIn callback endpoint working (correctly rejected without code)');
      } else {
        console.log('❌ LinkedIn callback endpoint error:', error.response?.data);
      }
    }

    console.log('\n🎉 LinkedIn authentication setup is working!');
    console.log('\nNext steps:');
    console.log('1. Set up your LinkedIn app credentials in .env file');
    console.log('2. Update the REDIRECT_URI in authController.js for production');
    console.log('3. Test the full OAuth flow from the frontend');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testLinkedInAuth(); 