interface AIResponse {
  success: boolean;
  message: string;
}

export async function generateAIResponse(prompt: string, maxTokens: number = 500): Promise<AIResponse> {
  try {
    const response = await fetch('/api/ai', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, maxTokens }),
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI response');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return {
      success: false,
      message: 'Failed to generate AI response. Please try again later.'
    };
  }
} 