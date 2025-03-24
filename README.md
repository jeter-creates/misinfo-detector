# Misinformation Detector

A client-side application that uses the Gemini API to analyze text credibility and detect potential misinformation.

## Technologies Used

- **Frontend**: React with TypeScript (Vite)
- **State Management**: Zustand
- **UI Components**: shadcn/ui (canary)
- **API Integration**: TanStack Query
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS

## Project Structure

```
/src
  /components     # UI components
  /lib           # Utility functions
  /stores        # Zustand stores
  /hooks         # Custom React hooks
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (7.0+)
- Gemini API key from Google AI Studio

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Set up your environment variables:
   - Copy the `.env.example` file to a new file named `.env`
   - Replace `your_api_key_here` with your actual Gemini API key

```bash
# Example
cp .env.example .env
```

4. Start the development server:

```bash
pnpm dev
```

### API Key Security

This project uses environment variables to securely store your API key:

- The `.env` file is listed in `.gitignore` to prevent it from being committed to your repository
- Never commit your actual API key to version control
- For production deployment, set the environment variables in your hosting platform (Vercel, Netlify, etc.)
- The API key is accessed via `import.meta.env.VITE_GEMINI_API_KEY` in the code

## Features

- Client-side only application
- Gemini API integration for text credibility analysis
- Google Search grounding for verifying claims against latest web information
- Modern and responsive design with shadcn/ui components
- Detailed analysis with credibility scoring

## How It Works

The Misinformation Detector uses the Gemini API with Google Search grounding to analyze text for credibility:

1. Users input text to be analyzed
2. The application sends the text to the Gemini API
3. Gemini analyzes the text and checks claims against recent web information using Google Search grounding
4. The analysis result is displayed with a credibility score and supporting evidence

### Google Search Grounding

This application uses Google Search grounding to improve response accuracy by retrieving relevant information from the web. The implementation includes:

- Dynamic retrieval that intelligently determines when web search would be beneficial
- Web search results displayed alongside the analysis 
- Supporting evidence from reliable sources to verify or dispute claims
- Automated fact-checking against the latest information

## License

MIT
