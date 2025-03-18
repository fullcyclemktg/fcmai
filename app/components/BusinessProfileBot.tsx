'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { generateAIResponse } from '../utils/openai';
import { useAuth } from '@/lib/auth/AuthContext';

// Debug environment variables
console.log('Environment variables in BusinessProfileBot:');
console.log('SUPABASE_URL available:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_ANON_KEY available:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Define the questions array
const INITIAL_QUESTIONS = [
  'What is the name of your company?',
  'What is your company url?',
  'What industry are you in?',
  'What product or service do you sell?',
  'What is the size of your business in revenue?',
  'How much did you spend on marketing last year?'
];

const MARKETING_GOALS_QUESTIONS = {
  initial: 'Do you already have specific marketing goals in mind? (yes/no)',
  direct: 'Please describe your marketing goals:',
  guided: [
    'Are you looking to increase brand awareness, generate leads, or improve conversions?',
    'What is your target audience or ideal customer profile?',
    'Do you currently have a marketing budget, or are you looking for budget recommendations?',
    'What timeframe are you looking to achieve these goals in?',
    'What marketing channels are you currently using or interested in exploring?'
  ]
};

interface BusinessProfile {
  id?: string;
  user_id: string;
  company_name: string;
  company_url: string;
  industry: string;
  product_service: string;
  revenue_size: string;
  marketing_spend: string;
  marketing_goals?: string;
  marketing_goals_details?: {
    goal_type?: string;
    target_audience?: string;
    budget_status?: string;
    timeframe?: string;
    channels?: string;
    ai_recommendations?: string;
  };
  ai_summary?: string;
}

export default function BusinessProfileBot() {
  const { user } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<Partial<BusinessProfile>>({});
  const [currentInput, setCurrentInput] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [aiSummary, setAiSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isInMarketingGoals, setIsInMarketingGoals] = useState(false);
  const [marketingGoalsStep, setMarketingGoalsStep] = useState(0);
  const [needsGuidance, setNeedsGuidance] = useState<boolean | null>(null);
  const [existingProfile, setExistingProfile] = useState<BusinessProfile | null>(null);

  // Load existing profile when component mounts
  useEffect(() => {
    const loadExistingProfile = async () => {
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from('business_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;
        if (data) {
          setExistingProfile(data);
          setUserResponses(data);
          setIsComplete(true);
          setAiSummary(data.ai_summary || '');
        }
      } catch (err) {
        console.error('Error loading profile:', err);
      }
    };

    loadExistingProfile();
  }, [user?.id]);

  const getCurrentQuestion = () => {
    if (!isInMarketingGoals) {
      return INITIAL_QUESTIONS[currentQuestionIndex];
    }

    if (marketingGoalsStep === 0) {
      return MARKETING_GOALS_QUESTIONS.initial;
    }

    if (needsGuidance === false) {
      return MARKETING_GOALS_QUESTIONS.direct;
    }

    return MARKETING_GOALS_QUESTIONS.guided[marketingGoalsStep - 1];
  };

  const handleMarketingGoalsResponse = async (input: string) => {
    if (marketingGoalsStep === 0) {
      const needsHelp = input.toLowerCase().startsWith('n');
      setNeedsGuidance(needsHelp);
      setMarketingGoalsStep(1);
      return true;
    }

    if (!needsGuidance) {
      const recommendations = await generateMarketingRecommendations(input);
      // Direct goals input
      setUserResponses(prev => ({
        ...prev,
        marketing_goals: input,
        marketing_goals_details: {
          ai_recommendations: recommendations
        }
      }));
      return false; // Complete marketing goals section
    }

    // Guided questions flow
    const updatedGoalsDetails = {
      ...userResponses.marketing_goals_details,
      [getGoalsDetailKey(marketingGoalsStep)]: input
    };

    setUserResponses(prev => ({
      ...prev,
      marketing_goals_details: updatedGoalsDetails
    }));

    if (marketingGoalsStep >= MARKETING_GOALS_QUESTIONS.guided.length) {
      // Generate AI summary of goals and recommendations
      const aiRecommendations = await generateMarketingRecommendations(
        JSON.stringify(updatedGoalsDetails)
      );
      
      setUserResponses(prev => ({
        ...prev,
        marketing_goals: aiRecommendations,
        marketing_goals_details: {
          ...updatedGoalsDetails,
          ai_recommendations: aiRecommendations
        }
      }));
      
      return false; // Complete marketing goals section
    }

    setMarketingGoalsStep(prev => prev + 1);
    return true; // Continue with more questions
  };

  const getGoalsDetailKey = (step: number) => {
    const keys = [
      'goal_type',
      'target_audience',
      'budget_status',
      'timeframe',
      'channels'
    ] as const;
    return keys[step - 1];
  };

  const generateMarketingRecommendations = async (context: string): Promise<string> => {
    const prompt = `Based on the following information about a business's marketing goals and context, 
    provide specific, actionable marketing recommendations and a clear goal statement:
    ${context}
    
    Please format your response as a concise, bullet-pointed list of goals and recommendations.`;

    const response = await generateAIResponse(prompt, 200);
    return response.success ? response.message : 'Unable to generate recommendations at this time.';
  };

  const handleSubmitResponse = async () => {
    if (!currentInput.trim() || !user?.id) return;
    setIsLoading(true);
    setError('');

    try {
      if (isInMarketingGoals) {
        const shouldContinue = await handleMarketingGoalsResponse(currentInput);
        if (!shouldContinue) {
          // Proceed to final summary
          await generateFinalSummary();
        }
      } else {
        // Handle initial questions
        const questionKeys: (keyof BusinessProfile)[] = [
          'company_name',
          'company_url',
          'industry',
          'product_service',
          'revenue_size',
          'marketing_spend'
        ];

        const currentKey = questionKeys[currentQuestionIndex];
        const newResponses = {
          ...userResponses,
          [currentKey]: currentInput,
          user_id: user.id
        };
        setUserResponses(newResponses);

        if (currentQuestionIndex === INITIAL_QUESTIONS.length - 1) {
          setIsInMarketingGoals(true);
          setMarketingGoalsStep(0);
        } else {
          setCurrentQuestionIndex(prev => prev + 1);
        }
      }

      setCurrentInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const generateFinalSummary = async () => {
    if (!user?.id) return;

    const summaryPrompt = `Please provide a concise business and marketing profile summary based on the following information:
      Company Name: ${userResponses.company_name}
      Company URL: ${userResponses.company_url}
      Industry: ${userResponses.industry}
      Product/Service: ${userResponses.product_service}
      Revenue Size: ${userResponses.revenue_size}
      Marketing Spend: ${userResponses.marketing_spend}
      Marketing Goals: ${userResponses.marketing_goals}
      Marketing Details: ${JSON.stringify(userResponses.marketing_goals_details)}`;

    const aiResponse = await generateAIResponse(summaryPrompt, 300);
    if (aiResponse.success) {
      setAiSummary(aiResponse.message);
      
      // Prepare the profile data
      const profileData = {
        ...userResponses,
        user_id: user.id,
        ai_summary: aiResponse.message,
        updated_at: new Date().toISOString()
      };

      // Upsert the profile (update if exists, insert if not)
      const { error: supabaseError } = await supabase
        .from('business_profiles')
        .upsert(profileData, {
          onConflict: 'user_id'
        });

      if (supabaseError) throw supabaseError;
      setIsComplete(true);
    } else {
      throw new Error(aiResponse.message);
    }
  };

  const handleStartOver = () => {
    setIsComplete(false);
    setCurrentQuestionIndex(0);
    setUserResponses({ user_id: user?.id || '' });
    setAiSummary('');
    setIsInMarketingGoals(false);
    setMarketingGoalsStep(0);
    setNeedsGuidance(null);
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-lg">Please sign in to create or update your business profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {!isComplete ? (
        <>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-lg font-medium">
              {getCurrentQuestion()}
            </p>
            {isInMarketingGoals && needsGuidance && marketingGoalsStep > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                Question {marketingGoalsStep} of {MARKETING_GOALS_QUESTIONS.guided.length}
              </p>
            )}
          </div>

          <div className="space-y-4">
            {Object.entries(userResponses).map(([key, value]) => (
              <div key={key} className="bg-gray-50 p-3 rounded">
                <span className="font-medium">{key.replace(/_/g, ' ')}: </span>
                {typeof value === 'object' ? JSON.stringify(value) : value}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              placeholder="Type your answer here..."
              className="flex-1 p-2 border rounded"
              disabled={isLoading}
            />
            <button
              onClick={handleSubmitResponse}
              disabled={isLoading || !currentInput.trim()}
              className={`px-4 py-2 rounded ${
                isLoading || !currentInput.trim()
                  ? 'bg-gray-300'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isLoading ? 'Processing...' : 'Next'}
            </button>
          </div>

          {error && (
            <p className="text-red-500">{error}</p>
          )}
        </>
      ) : (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Business & Marketing Profile Summary</h2>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="whitespace-pre-line">{aiSummary}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleStartOver}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Update Profile
            </button>
            {existingProfile && (
              <button
                onClick={() => {
                  setUserResponses(existingProfile);
                  setIsComplete(true);
                  setAiSummary(existingProfile.ai_summary || '');
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Restore Previous Version
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 