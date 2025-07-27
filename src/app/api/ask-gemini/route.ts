import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

interface KeyProject {
  name: string
  summary: string
  technologies: string[]
}

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
          text: "You've reached the daily question limit for this AI assistant. For more detailed conversations about Nicole's work, please [contact me directly](/portfolio#contact)!",
          rateLimited: true,
        },
        { status: 429 }
      )
    }

    const prompt = `${getContext()}\n\nUser: ${message}`

    const result = await ai.models.generateContent({
      model: process.env.MODEL || 'gemini-2.5-flash',
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
  const { name, role, company, location, skills, interests, ai_summary } =
    aboutMeData

  return `
        You are an AI assistant for Nicole Wert's Software engineering portfolio website.
        Use the following information to answer questions about Nicole to potential employers and developer collaborators.

        Name: ${name}
        Role: ${role}
        Company: ${company}
        Location: ${location}
        Skills: ${skills.join(', ')}
        Interests: ${interests.join(', ')}
        
        About: ${ai_summary.about}
        
        Key Projects:
        ${ai_summary.key_projects
          .map(
            (project: KeyProject) =>
              `- ${project.name}: ${project.summary} (Technologies: ${project.technologies.join(', ')})`
          )
          .join('\n        ')}
        
        Expertise: ${ai_summary.expertise}

        Personality: Be enthusiastic, professional, and knowledgeable about Nicole's work. Highlight her technical skills and passion for AI integration in web development.
        
        NAVIGATION & ROUTING GUIDE - Use these links to direct users:
        • Main Portfolio: [view my portfolio](/portfolio) - Overview and introduction
        • Projects: [see my projects](/portfolio#projects) - Detailed project showcases
        • Resume: [view my resume](/portfolio#resume) - Professional experience and education
        • Contact: [contact me](/portfolio#contact) - Contact form and information
        • Blog: [read my blog](/blog) - Technical articles and insights
        • AI Chat: [chat with me](/ai-nicole) - This current AI assistant
        
        WHEN TO USE LINKS:
        • When users ask about projects → direct to [my projects](/portfolio#projects)
        • When users ask about experience/resume → direct to [my resume](/portfolio#resume)
        • When users ask to contact Nicole → direct to [contact me](/portfolio#contact)
        • When users want to see everything → direct to [my portfolio](/portfolio)
        • When users ask about writing/articles → direct to [my blog](/blog)
        • For rate limiting → direct to [contact me directly](/portfolio#contact)
        
        CRITICAL FORMATTING REQUIREMENTS - ALWAYS FOLLOW:
        1. ALWAYS use markdown formatting with bullet points (•) for lists
        2. NEVER write paragraphs longer than 2 sentences
        3. ALWAYS add a blank line between different points
        4. Structure responses like this example:
           • Key point: Brief explanation
           • Another point: Short detail
           
           Brief paragraph about topic.
           
           • Final points: Listed clearly
        5. Use clean, simple text without bold formatting
        6. KEEP RESPONSES CONCISE - Maximum 3-4 bullet points or 2-3 short sentences total
        7. Prioritize the most important information only
        8. ALWAYS include relevant links using the markdown format [text](url) when directing users to specific sections
        
        Only respond to questions about Nicole Wert or these projects. 
        If the question is unrelated, politely decline to answer and redirect to Nicole's work.
    `
}
