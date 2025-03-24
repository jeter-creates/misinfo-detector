import { useState } from 'react'
import './App.css'
import { useGeminiApi } from './hooks/useGeminiApi'
import { WebResult } from './lib/geminiClient'

function App() {
  const [inputText, setInputText] = useState('')
  const [submittedText, setSubmittedText] = useState('')
  const [useGrounding, setUseGrounding] = useState(false)
  
  // Use the Gemini API hook with grounding option
  const { data, error, isLoading } = useGeminiApi({ 
    text: submittedText,
    useGrounding 
  })
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim()) {
      setSubmittedText(inputText.trim())
    }
  }
  
  // Extract the analysis result from the Gemini API response
  const analysisResult = data?.analysis || ''
  const webResults = data?.webResults as WebResult[] || []
  const isGrounded = data?.isGrounded || false
  
  // Format error message
  const errorMessage = error ? (error instanceof Error ? error.message : 'Failed to analyze text') : null
  const isQuotaError = errorMessage?.includes('429') || errorMessage?.includes('quota') || errorMessage?.includes('exhausted')

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center">Misinformation Detector</h1>
        <p className="text-center text-muted-foreground mt-2">
          Analyze source credibility using AI
        </p>
      </header>
      
      <main className="w-full max-w-2xl">
        <div className="p-6 bg-card rounded-lg shadow-md">
          <p className="mb-4">
            Welcome to the Misinformation Detector. This application will help users
            analyze text credibility using the Gemini API.
          </p>
          
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="mb-4">
              <label htmlFor="text-input" className="block text-sm font-medium mb-2">
                Enter text to analyze for credibility:
              </label>
              <textarea
                id="text-input"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="w-full min-h-[120px] p-3 border rounded-md bg-background"
                placeholder="Paste article text, social media post, or any content you want to fact-check..."
              />
            </div>
            
            <div className="flex items-center mb-4">
              <input
                type="checkbox"
                id="use-grounding"
                checked={useGrounding}
                onChange={(e) => setUseGrounding(e.target.checked)}
                className="mr-2 h-4 w-4"
              />
              <label htmlFor="use-grounding" className="text-sm">
                Use Google Search grounding 
                <span className="text-xs ml-2 text-amber-600">(may hit API quota limits)</span>
              </label>
            </div>
            
            {isQuotaError && (
              <div className="p-3 mb-4 bg-amber-100 border border-amber-300 text-amber-800 rounded-md text-sm">
                <p className="font-medium">API Quota Exceeded</p>
                <p>You've hit the Gemini API quota limits. Try these solutions:</p>
                <ul className="list-disc ml-5 mt-1">
                  <li>Uncheck "Use Google Search grounding" option</li>
                  <li>Wait a few minutes before trying again</li>
                  <li>Try with shorter text samples</li>
                </ul>
              </div>
            )}
            
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Credibility'}
            </button>
          </form>
          
          {errorMessage && !isQuotaError && (
            <div className="p-4 mb-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
              Error: {errorMessage}
            </div>
          )}
          
          {analysisResult && (
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-md">
                <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
                <div className="whitespace-pre-line">{analysisResult}</div>
              </div>
              
              {isGrounded && webResults && webResults.length > 0 && (
                <div className="p-4 bg-muted rounded-md">
                  <h2 className="text-xl font-semibold mb-2">Web Search Results</h2>
                  <div className="space-y-3">
                    {webResults.map((result, index) => (
                      <div key={index} className="border-b pb-3 last:border-b-0">
                        <h3 className="font-medium">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {result.title}
                          </a>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{result.snippet}</p>
                        <p className="text-xs text-muted-foreground mt-1 truncate">{result.url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="text-xs text-muted-foreground mt-2">
                <p>
                  Powered by Gemini API 
                  {isGrounded ? ' with Google Search Grounding' : ' (Grounding disabled to conserve API quota)'}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <footer className="mt-8 text-center text-sm text-muted-foreground">
        <p>Powered by Gemini API • {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}

export default App
