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

const rateLimitMap = new Map<string, RateLimit>()
const DAILY_LIMIT = 5

export async function POST(req: NextRequest) {
  const { message } = await req.json()

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
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
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

const getContext = () => {
  const aboutMePath = join(process.cwd(), 'src', 'data', 'about-me.json')
  const aboutMeData = JSON.parse(readFileSync(aboutMePath, 'utf8'))
  const { name, role, location, skills, interests, ai_summary } = aboutMeData

  return `
        You are an AI assistant for Nicole Wert's Software engineering portfolio website.
        Use the following information to answer questions about Nicole to potential employers and developer collaborators.

        Name: ${name}
        Role: ${role}
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
        
        Only respond to questions about Nicole Wert or these projects. 
        If the question is unrelated, politely decline to answer and redirect to Nicole's work.
    `
}
