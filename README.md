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

- Node.js (v16+)
- pnpm
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

- Text analysis for credibility
- Misinformation detection
- Modern and responsive UI
- Client-side only (no backend required)

## License

MIT
