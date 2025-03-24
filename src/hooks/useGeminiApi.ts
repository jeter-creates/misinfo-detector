import { useQuery } from '@tanstack/react-query'
import { config } from '../lib/config'

interface AnalyzeTextOptions {
  text: string
  apiKey?: string
}

interface GeminiApiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string
      }>
    },
    finishReason: string,
    index: number,
    safetyRatings: Array<{
      category: string,
      probability: string
    }>
  }>,
  promptFeedback?: {
    safetyRatings: Array<{
      category: string,
      probability: string
    }>
  }
}

const fetchGeminiApi = async ({ text, apiKey = config.gemini.apiKey }: AnalyzeTextOptions): Promise<GeminiApiResponse> => {
  const response = await fetch(config.gemini.endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `Analyze the following text for credibility and potential misinformation. 
                     Provide a detailed assessment with a credibility score from 0-100.
                     Text to analyze: "${text}"`
            }
          ]
        }
      ]
    })
  })
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Failed to fetch from Gemini API');
  }

  return response.json()
}

export const useGeminiApi = ({ text, apiKey = config.gemini.apiKey }: AnalyzeTextOptions) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['gemini-api', text],
    queryFn: () => fetchGeminiApi({ text, apiKey }),
    enabled: !!text
  })

  return { data, error, isLoading }
}
