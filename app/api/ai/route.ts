import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt, maxTokens } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant that provides clear, concise, and professional responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: maxTokens || 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'No response generated.';
    
    return NextResponse.json({
      success: true,
      message: response
    });
  } catch (error) {
    console.error('Error generating AI response:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to generate AI response. Please try again later.'
    }, { status: 500 });
  }
} 