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

### Installation

1. Clone the repository
2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

### Configuration

You'll need to obtain a Gemini API key from Google AI Studio and configure it in the application.

## Features

- Text analysis for credibility
- Misinformation detection
- Modern and responsive UI
- Client-side only (no backend required)

## License

MIT
