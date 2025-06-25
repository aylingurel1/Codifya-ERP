// Auth API Test Script
const BASE_URL = 'http://localhost:3000'

async function testRegister() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: '123456',
        role: 'ADMIN'
      }),
    })

    const result = await response.json()
    console.log('Register Response:', result)
    return result
  } catch (error) {
    console.error('Register Error:', error)
  }
}

async function testLogin() {
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: '123456'
      }),
    })

    const result = await response.json()
    console.log('Login Response:', result)
    return result
  } catch (error) {
    console.error('Login Error:', error)
  }
}

async function runTests() {
  console.log('Testing Auth APIs...')
  
  console.log('\n1. Testing Register...')
  await testRegister()
  
  console.log('\n2. Testing Login...')
  await testLogin()
}

runTests() 