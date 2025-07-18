// Test script for the contact form API
// Run with: node scripts/test-api.js

const testContactForm = async () => {
  const testData = {
    name: 'Test User',
    email: 'test@example.com',
    message: 'This is a test message from the contact form.',
    company: '', // honeypot field should be empty
  }

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    })

    const result = await response.json()

    console.log('Status:', response.status)
    console.log('Response:', result)

    if (response.ok) {
      console.log('✅ Contact form submission successful!')
    } else {
      console.log('❌ Contact form submission failed')
    }
  } catch (error) {
    console.error('Error testing contact form:', error)
  }
}

const testHoneypot = async () => {
  const botData = {
    name: 'Bot User',
    email: 'bot@spam.com',
    message: 'This is spam',
    company: 'Spam Company', // honeypot field filled - should be rejected
  }

  try {
    const response = await fetch('http://localhost:3000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(botData),
    })

    const result = await response.json()

    console.log('\\nHoneypot Test:')
    console.log('Status:', response.status)
    console.log('Response:', result)

    if (response.status === 400) {
      console.log('✅ Honeypot protection working!')
    } else {
      console.log('❌ Honeypot protection failed')
    }
  } catch (error) {
    console.error('Error testing honeypot:', error)
  }
}

// Run tests
console.log('Testing Contact Form API...')
console.log('Make sure your development server is running (npm run dev)')
console.log('And your environment variables are set up correctly\\n')

testContactForm()
setTimeout(testHoneypot, 1000) // Wait 1 second between tests
