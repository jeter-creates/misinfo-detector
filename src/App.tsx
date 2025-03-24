import { useState } from 'react'
import './App.css'
import { useGeminiApi } from './hooks/useGeminiApi'

function App() {
  const [inputText, setInputText] = useState('')
  const [submittedText, setSubmittedText] = useState('')
  
  // Use the Gemini API hook
  const { data, error, isLoading } = useGeminiApi({ text: submittedText })
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputText.trim()) {
      setSubmittedText(inputText.trim())
    }
  }
  
  // Extract the analysis result from the Gemini API response
  const analysisResult = data?.candidates?.[0]?.content?.parts?.[0]?.text || ''

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
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Credibility'}
            </button>
          </form>
          
          {error && (
            <div className="p-4 mb-4 bg-destructive/10 border border-destructive text-destructive rounded-md">
              Error: {error instanceof Error ? error.message : 'Failed to analyze text'}
            </div>
          )}
          
          {analysisResult && (
            <div className="p-4 bg-muted rounded-md">
              <h2 className="text-xl font-semibold mb-2">Analysis Result</h2>
              <div className="whitespace-pre-line">{analysisResult}</div>
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
