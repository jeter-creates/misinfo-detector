// Configuration for the application
export const config = {
  // Gemini API configuration
  gemini: {
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || '',
    endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent' // Use v1beta for consistency
  }
}
