import React, { useState, useEffect } from 'react'
import './App.css'
import { useGeminiApi } from './hooks/useGeminiApi'
import { WebResult } from './lib/geminiClient'

function App() {
  const [inputText, setInputText] = useState('')
  const [submittedText, setSubmittedText] = useState('')
  const [useGrounding, setUseGrounding] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  
  // Initialize theme based on system preference or localStorage on mount
  useEffect(() => {
    // Check localStorage or system preference
    const savedTheme = localStorage.theme || 
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    
    setTheme(savedTheme as 'light' | 'dark');
    
    // Listen for system preference changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.theme) { // Only auto-switch if user hasn't manually set a preference
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Update DOM and localStorage when theme changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    }
    
    localStorage.theme = theme;
  }, [theme]);
  
  // Toggle theme function
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
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
    <div className={`min-h-screen bg-gradient-to-b from-background to-muted text-foreground flex flex-col ${theme === 'dark' ? 'dark' : 'light'}`}>
      <header className="py-6 border-b border-border/30 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <div className="flex items-center">
            <svg 
              className="w-8 h-8 text-primary mr-3" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-700">
                Misinformation Detector
              </h1>
              <p className="text-sm text-muted-foreground">
                Powered by Gemini AI
              </p>
            </div>
            <button 
              className="ml-4 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors"
              onClick={toggleTheme}
            >
              <svg 
                className="w-6 h-6 text-primary" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                {theme === 'dark' ? (
                  <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707"></path>
                ) : (
                  <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-1 py-10 container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="rounded-xl shadow-lg overflow-hidden mb-10 bg-card">
            <div className="p-6 bg-primary/5 border-b border-border">
              <h2 className="text-xl font-semibold flex items-center">
                <svg 
                  className="w-5 h-5 mr-2 text-primary" 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                Verify Content Credibility
              </h2>
              <p className="text-muted-foreground mt-1">
                Analyze text for potential misinformation and credibility issues
              </p>
            </div>
            
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="text-input" className="block text-sm font-medium mb-2">
                    Enter text to analyze:
                  </label>
                  <textarea
                    id="text-input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="w-full min-h-[150px] p-4 border rounded-lg bg-background/50 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    placeholder="Paste article text, social media post, or any content you want to fact-check..."
                  />
                </div>
                
                <div className="flex items-center p-3 rounded-lg bg-secondary/50 border border-border/50">
                  <div className="relative inline-flex h-5 w-10 items-center rounded-full mr-3">
                    <input
                      type="checkbox"
                      id="use-grounding"
                      checked={useGrounding}
                      onChange={(e) => setUseGrounding(e.target.checked)}
                      className="peer sr-only"
                    />
                    <span className="absolute inset-0 rounded-full bg-gray-300 transition peer-checked:bg-primary"></span>
                    <span className="absolute inset-0 m-0.5 h-4 w-4 rounded-full bg-white transition-all peer-checked:translate-x-5"></span>
                  </div>
                  <label htmlFor="use-grounding" className="text-sm flex-1">
                    Enable Google Search grounding
                    <span className="block text-xs text-muted-foreground">Get real-time verification from web sources</span>
                  </label>
                  {useGrounding && (
                    <div className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                      May use more API quota
                    </div>
                  )}
                </div>
                
                {isQuotaError && (
                  <div className="p-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg flex items-start">
                    <svg 
                      className="w-5 h-5 mr-3 mt-0.5 text-amber-500" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
                      <line x1="12" y1="9" x2="12" y2="13"></line>
                      <line x1="12" y1="17" x2="12.01" y2="17"></line>
                    </svg>
                    <div>
                      <p className="font-medium">API Quota Exceeded</p>
                      <p className="text-sm mt-1">Try these solutions:</p>
                      <ul className="list-disc ml-5 mt-1 text-sm space-y-1">
                        <li>Disable Google Search grounding</li>
                        <li>Wait a few minutes before trying again</li>
                        <li>Use shorter text samples</li>
                      </ul>
                    </div>
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isLoading || !inputText.trim()}
                  className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 
                    disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <svg 
                        className="w-5 h-5 mr-2" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                      </svg>
                      Analyze Credibility
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {errorMessage && !isQuotaError && (
            <div className="p-4 mb-6 bg-destructive/10 border border-destructive text-destructive rounded-lg flex items-start">
              <svg 
                className="w-5 h-5 mr-3 mt-0.5 text-destructive" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{errorMessage}</p>
              </div>
            </div>
          )}
          
          {analysisResult && (
            <div className="space-y-6">
              <div className="rounded-xl overflow-hidden shadow-lg border border-border/50 bg-card">
                <div className="p-5 bg-primary/5 border-b border-border flex items-center">
                  <svg 
                    className="w-5 h-5 mr-2 text-primary" 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <line x1="10" y1="9" x2="8" y2="9"></line>
                  </svg>
                  <h2 className="text-xl font-semibold">Analysis Result</h2>
                </div>
                <div className="p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:font-semibold prose-headings:text-primary-foreground prose-h3:text-base prose-h2:text-lg prose-p:text-muted-foreground prose-strong:text-foreground">
                    {analysisResult.split("\n").map((line, i, lines) => {
                      // Detect section headers starting with '-' and style them
                      if (line.trim().startsWith('-')) {
                        const sectionName = line.trim().substring(1).trim();
                        
                        // Determine color based on section - using consistent primary color for all sections
                        let borderColor = "border-primary";
                        let bgColor = "bg-primary/5 dark:bg-primary/10";
                        let textColor = "text-primary";
                        
                        return (
                          <div key={i} className="mb-4">
                            <h3 className={`font-bold text-lg ${textColor} ${bgColor} py-2 px-3 rounded-md mt-5 mb-3 border-l-4 ${borderColor}`}>
                              {sectionName}
                            </h3>
                          </div>
                        );
                      }
                      
                      // Track what section we're in
                      let currentSection = "";
                      // Look backward to find the most recent section header
                      for (let j = i; j >= 0; j--) {
                        const prevLine = lines[j];
                        if (prevLine.trim().startsWith('-')) {
                          currentSection = prevLine.trim().substring(1).trim().toLowerCase();
                          break;
                        }
                      }
                      
                      // Special handling for Credibility Score
                      if (currentSection.includes('credibility') && line.trim() !== "") {
                        // Try to extract any numbers that might be scores
                        const numbers = line.match(/\d+/g);
                        const hasScore = numbers && numbers.length > 0;
                        
                        if (hasScore) {
                          const score = parseInt(numbers[0]);
                          
                          // Use consistent styling regardless of score
                          const bgColor = "bg-card dark:bg-card/40";
                          const borderColor = "border-border/30";
                          
                          return (
                            <div key={i} className={`mb-4 ${bgColor} rounded-md p-4 border ${borderColor} flex items-center`}>
                              <div className="mr-4">
                                <div className="text-2xl font-bold text-foreground">{score}/100</div>
                                <div className="text-xs text-muted-foreground">Credibility Score</div>
                              </div>
                              <p className="text-foreground flex-1">{line}</p>
                            </div>
                          );
                        }
                      }
                      
                      // Special handling for Summary section (usually the first paragraph after Summary header)
                      if (currentSection.includes('summary') && line.trim() !== "" && !line.includes(":")) {
                        return (
                          <div key={i} className="mb-4 bg-blue-50/50 dark:bg-blue-900/5 rounded-md p-4 border border-blue-100 dark:border-blue-900/20">
                            <p className="text-foreground italic">{line}</p>
                          </div>
                        );
                      }
                      
                      // Special handling for Key Claims Analysis section
                      if (line.trim().includes(":") && !line.trim().startsWith("-")) {
                        // Split the line at the first colon to separate the claim from the analysis
                        const colonIndex = line.indexOf(":");
                        if (colonIndex > 0) {
                          const claim = line.substring(0, colonIndex).trim();
                          const analysis = line.substring(colonIndex + 1).trim();
                          
                          // Check if this is potentially a claim with analysis
                          if (claim.length > 3 && claim.length < 100 && analysis.length > 10) {
                            // Determine styling based on current section - using consistent primary color
                            let borderColor = "border-primary/30";
                            
                            return (
                              <div key={i} className="mb-4 bg-card dark:bg-card/40 rounded-md p-3 border border-border/30">
                                <p className="font-medium text-foreground mb-1">{claim}:</p>
                                <p className={`text-muted-foreground pl-2 border-l-2 ${borderColor}`}>{analysis}</p>
                              </div>
                            );
                          }
                        }
                      }
                      
                      // Return regular paragraph
                      return line.trim() !== "" ? <p key={i} className="mb-3">{line}</p> : <br key={i} />;
                    })}
                  </div>
                </div>
              </div>
              
              {isGrounded && webResults && webResults.length > 0 && (
                <div className="rounded-xl overflow-hidden shadow-lg border border-border/50 bg-card">
                  <div className="p-5 bg-blue-50 dark:bg-blue-900/20 border-b border-border flex items-center">
                    <svg 
                      className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" 
                      xmlns="http://www.w3.org/2000/svg" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="2" y1="12" x2="22" y2="12"></line>
                      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    </svg>
                    <h2 className="text-xl font-semibold">Web Search Results</h2>
                  </div>
                  <div className="p-6 divide-y divide-border">
                    {webResults.map((result, index) => (
                      <div key={index} className="py-3 first:pt-0 last:pb-0">
                        <h3 className="font-medium">
                          <a 
                            href={result.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 hover:underline flex items-center"
                          >
                            {result.title}
                            <svg 
                              className="w-3.5 h-3.5 ml-1 inline-block" 
                              xmlns="http://www.w3.org/2000/svg" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                              <polyline points="15 3 21 3 21 9"></polyline>
                              <line x1="10" y1="14" x2="21" y2="3"></line>
                            </svg>
                          </a>
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{result.snippet}</p>
                        <p className="text-xs text-muted-foreground/70 mt-1 truncate">{result.url}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-6 border-t border-border/30 mt-auto bg-background">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg 
              className="w-5 h-5 text-primary mr-2" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <span className="font-medium">Misinformation Detector</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Powered by Gemini API {isGrounded ? 'with Google Search Grounding' : ''} • {new Date().getFullYear()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Using {theme === 'dark' ? 'dark' : 'light'} mode • 
            <button 
              onClick={toggleTheme} 
              className="ml-1 text-primary hover:underline focus:outline-none"
            >
              Switch to {theme === 'dark' ? 'light' : 'dark'} mode
            </button>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
