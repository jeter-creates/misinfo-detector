import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

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
          <div className="flex justify-center">
            <button
              onClick={() => setCount((count) => count + 1)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              count is {count}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
