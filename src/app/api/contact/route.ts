import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { checkRateLimit, getClientIP } from '@/lib/rateLimit'
import { validateContactForm, sanitizeInput, contactFormSchema } from '@/lib/validation'

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const clientIP = getClientIP(request)
    
    // Check rate limit
    const rateLimit = checkRateLimit(clientIP)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + 60 * 60 * 1000).toISOString()
          }
        }
      )
    }

    // Parse request body
    let formData
    try {
      formData = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      )
    }

    // Validate form data
    const validation = validateContactForm(formData)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Please check your input and try again.' },
        { status: 400 }
      )
    }

    // Parse the validated data to get proper types
    const validatedData = contactFormSchema.parse(formData)

    // Sanitize inputs
    const sanitizedData = {
      name: sanitizeInput(validatedData.name),
      email: sanitizeInput(validatedData.email),
      message: sanitizeInput(validatedData.message)
    }

    // Store in database
    const { error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert([sanitizedData])

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json(
        { error: 'Something went wrong. Please try again later.' },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Thanks for reaching out! I\'ll get back to you soon.',
        success: true 
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString()
        }
      }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    )
  }
}
