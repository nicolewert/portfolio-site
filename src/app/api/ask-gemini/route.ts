import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

interface KeyProject {
  name: string
  summary: string
  technologies: string[]
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export async function POST(req: NextRequest) {
  const { message } = await req.json()

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
