import { useQuery } from '@tanstack/react-query'
import { analyzeTextCredibility, AnalysisResult } from '../lib/geminiClient'

interface AnalyzeTextOptions {
  text: string
  useGrounding?: boolean
}

export const useGeminiApi = ({ text, useGrounding = false }: AnalyzeTextOptions): { data: AnalysisResult | undefined, error: unknown | null, isLoading: boolean } => {
  const { data, error, isLoading } = useQuery<AnalysisResult>({
    queryKey: ['gemini-api', text, useGrounding],
    queryFn: async () => {
      // Use the grounded analyzeTextCredibility function with the grounding option
      return await analyzeTextCredibility(text, useGrounding);
    },
    enabled: !!text // Only run the query if text is provided
  })

  return { data, error, isLoading }
}
