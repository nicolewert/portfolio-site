import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

interface RateLimit {
  count: number
  resetTime: Date
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

const rateLimitMap = new Map()
const DAILY_LIMIT = 5
const MAX_MESSAGE_LENGTH = 500
const MIN_MESSAGE_LENGTH = 1

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { message } = body

    // Basic input validation
    const validationError = validateInput(message)
    if (validationError) {
      return NextResponse.json(
        {
          text: validationError,
          error: true,
        },
        { status: 400 }
      )
    }

    const clientIP =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const rateLimitCheck = checkRateLimit(clientIP)
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          text: "You've reached the daily question limit for this AI assistant. Feel free to [visit the homepage](/) to explore Nicole's portfolio!",
          rateLimited: true,
        },
        { status: 429 }
      )
    }

    const prompt = `${getContext()}\n\nUser: ${message}`

    const result = await ai.models.generateContent({
      model: process.env.MODEL || 'gemini-2.5-flash',
      config: {
        maxOutputTokens: 800,
      },
      contents: {
        role: 'user',
        parts: [{ text: prompt }],
      },
    })

    const text =
      result.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response."
    return NextResponse.json({ text })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      {
        text: 'Sorry, there was an error processing your request. Please try again.',
        error: true,
      },
      { status: 500 }
    )
  }
}

function checkRateLimit(ip: string) {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const existing = rateLimitMap.get(ip)

  if (!existing || existing.resetTime < todayStart) {
    rateLimitMap.set(ip, { count: 1, resetTime: todayStart })
    return { allowed: true, remaining: DAILY_LIMIT - 1 }
  }

  if (existing.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  existing.count++
  return { allowed: true, remaining: DAILY_LIMIT - existing.count }
}

function validateInput(message: string | unknown[]) {
  // Check if message exists and is a string
  if (!message || typeof message !== 'string') {
    return 'Please provide a valid message.'
  }

  // Check message length
  if (message.length < MIN_MESSAGE_LENGTH) {
    return 'Message is too short. Please ask a question.'
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return `Message is too long. Please keep it under ${MAX_MESSAGE_LENGTH} characters.`
  }

  // Basic content filtering
  const suspiciousPatterns = [
    /ignore.*(previous|above|system)/i,
    /forget.*(instructions|prompt)/i,
    /you are now/i,
    /new instructions/i,
    /override/i,
    /jailbreak/i,
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(message)) {
      return "I can only answer questions about Nicole's work and projects."
    }
  }

  return null
}

const getContext = () => {
  const aboutMePath = join(process.cwd(), 'src', 'data', 'about-me.json')
  const aboutMeData = JSON.parse(readFileSync(aboutMePath, 'utf8'))
  const { ai_context } = aboutMeData

  const skillsSection = Object.entries(
    ai_context.skills as Record<string, string[]>
  )
    .map(
      ([category, items]) =>
        `  ${category.replace(/_/g, ' ')}: ${items.join(', ')}`
    )
    .join('\n')

  const workSection = ai_context.work_history
    .map(
      (job: {
        role: string
        company: string
        duration: string
        location: string
        highlights: string[]
      }) =>
        `  ${job.role} at ${job.company} (${job.duration}, ${job.location})\n${job.highlights.map((h: string) => `    - ${h}`).join('\n')}`
    )
    .join('\n\n')

  return `
        You are an AI assistant for Nicole Wert's Software engineering portfolio website.
        Use the following information to answer questions about Nicole to potential employers and developer collaborators.

        Name: ${ai_context.name}
        Current Role: ${ai_context.current_role} at ${ai_context.current_company}
        Location: ${ai_context.location}

        Summary: ${ai_context.summary}

        Skills:
${skillsSection}

        Work History:
${workSection}

        Education: ${ai_context.education.degrees.join(' & ')} from ${ai_context.education.school} (graduated ${ai_context.education.graduated})

        Exploration Projects: ${ai_context.exploration_projects.join('; ')}

        Personality: Friendly, casual, and confident — like texting a friend who happens to know everything about Nicole.

        NAVIGATION LINKS (use when relevant):
        • Projects: [check out her projects](/#lab)
        • Experience: [see her experience](/#journey)
        • Blog: [read her blog](/blog)
        • Home: [visit the homepage](/)

        CRITICAL RESPONSE STYLE - YOU MUST FOLLOW THESE:
        1. Respond like a SHORT TEXT MESSAGE. 1-3 sentences max. That's it.
        2. Never write more than 50 words unless absolutely necessary.
        3. No bullet point lists. No numbered lists. Just talk naturally.
        4. Pick the single most important thing to say and say it.
        5. If someone asks about skills, don't list them all — mention 2-3 highlights and link to the site.
        6. If someone asks about work history, give the current role + one sentence, then link to the experience section.
        7. Use markdown links [like this](/) when directing users somewhere.
        8. No bold text. No headers. Just casual, concise text.

        Example good responses:
        - "She's a senior full-stack engineer at Hilton, working with React and Node.js. [Check out her experience](/#journey) for the full story!"
        - "Yep! She's super into AI integration — built an AI chatbot (hi, that's me) and works with LLMs. [See her projects](/#lab)"

        Only answer questions about Nicole. If it's off-topic, keep the redirect short and friendly.
    `
}
