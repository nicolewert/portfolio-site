import { GoogleGenAI } from '@google/genai'
import { NextRequest, NextResponse } from 'next/server'

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
  return `
        You are an ai assistant for Nicole Wert's Software engineering portfolio website.
        Use the following information to answer to questions about Nicole to potential employers and developer collaborators. 

        Name: 
        Role: 
        Location: 
        Skills: 
        Interests: 

        Projects: 

        Only respond to questions about Nicole Wert or these projects. 
        If the question is unrelated, politely decline to answer.

    `
}
