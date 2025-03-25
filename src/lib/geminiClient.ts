import { GoogleGenerativeAI, DynamicRetrievalMode } from '@google/generative-ai';
import { config } from './config';

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

// Create a model with Google Search grounding enabled
export const getGroundedModel = (useGrounding = false) => {
  // If grounding is disabled, just return a basic model
  if (!useGrounding) {
    return genAI.getGenerativeModel({
      model: "gemini-1.5-flash", // Use same model but without grounding
    }, { apiVersion: "v1beta" }); // Ensure consistent API version
  }
  
  // Otherwise return model with grounding capabilities
  return genAI.getGenerativeModel(
    {
      model: "gemini-1.5-flash",
      tools: [
        {
          googleSearchRetrieval: {
            dynamicRetrievalConfig: {
              mode: DynamicRetrievalMode.MODE_DYNAMIC,
              dynamicThreshold: 0.3, // Lower threshold to 0.3 (default) to reduce unnecessary searches
            },
          },
        },
      ],
    },
    { apiVersion: "v1beta" } // Ensure consistent API version
  );
};

// Interfaces for our expected output data types
export interface WebSearchQuery {
  query: string;
}

export interface WebResult {
  title: string;
  url: string;
  snippet: string;
}

// The actual response shape we'll return to our application
export interface AnalysisResult {
  analysis: string;
  groundingMetadata?: any;
  webSearchQueries?: WebSearchQuery[];
  webResults?: WebResult[];
  isGrounded: boolean;
}

// Function to convert API response data to our expected format
const convertToWebResults = (apiWebResults: any[]): WebResult[] => {
  if (!apiWebResults || !Array.isArray(apiWebResults)) {
    return [];
  }
  
  return apiWebResults.map((result: any) => ({
    title: result.title || '',
    url: result.url || '',
    snippet: result.snippet || ''
  }));
};

const convertToWebSearchQueries = (apiQueries: any[]): WebSearchQuery[] => {
  if (!apiQueries || !Array.isArray(apiQueries)) {
    return [];
  }
  
  return apiQueries.map((query: any) => ({
    query: typeof query === 'string' ? query : query.query || ''
  }));
};

// Function to analyze text credibility with grounding
export const analyzeTextCredibility = async (text: string, useGrounding = false): Promise<AnalysisResult> => {
  try {
    const model = getGroundedModel(useGrounding);

    // Add current date context to help the model understand "now"
    const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Include factual context about current US president to help model accuracy
    const promptText = `Today's date is ${currentDate}.

      Analyze the following text for credibility and potential misinformation. 
      Provide a detailed assessment with a credibility score from 0-100 where 0 is completely false and 100 is completely credible.
      ${useGrounding ? 'For any claims that seem questionable, use recent information from the web to verify them.' : 'Use your most up-to-date knowledge to evaluate the claims in the text.'}
      
      Text to analyze: "${text}"
      
      Format your response with these sections:
      - Summary: (Brief assessment of overall credibility)
      - Credibility Score: (0-100)
      - Key Claims Analysis: (Analyze major claims in the text and their accuracy)
      ${useGrounding ? '- Supporting Evidence: (List supporting evidence from the web if available)' : ''}
      - Misinformation Detected: (Highlight any potential misinformation)
      - Recommendations: (How a reader should interpret this information)
      
      Important: For any claims about current political leaders, officials, or recent events, please be sure to verify with the most current information.`;

    // Simply call the API directly with the text prompt
    const result = await model.generateContent(promptText);
    
    const response = result.response;
    
    // Safely extract grounding data with explicit 'any' type
    const groundingData: any = useGrounding ? (response.candidates?.[0]?.groundingMetadata || {}) : {};
    
    // Extract web search data with safe defaults
    const webSearchQueries = useGrounding ? convertToWebSearchQueries(
      Array.isArray(groundingData.webSearchQueries) ? groundingData.webSearchQueries : []
    ) : [];
    
    const webResults = useGrounding ? convertToWebResults(
      Array.isArray(groundingData.webResults) ? groundingData.webResults : []
    ) : [];
    
    return {
      analysis: response.text().replace(/\*/g, ''),
      groundingMetadata: groundingData,
      webSearchQueries,
      webResults,
      isGrounded: useGrounding
    };
  } catch (error) {
    console.error('Error analyzing text with Gemini API:', error);
    throw error;
  }
};
