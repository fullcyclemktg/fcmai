import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generates an AI response using GPT-4
 * @param prompt - The input prompt for the AI
 * @param maxTokens - Maximum number of tokens in the response (default: 100)
 * @returns Promise<string> - The AI-generated response
 */
export async function generateAIResponse(
  prompt: string,
  maxTokens: number = 100
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: maxTokens,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "No response generated.";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "AI service is temporarily unavailable. Please try again later.";
  }
} 