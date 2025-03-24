import { create } from 'zustand'

interface TextState {
  text: string
  isAnalyzing: boolean
  result: any | null
  setText: (text: string) => void
  setIsAnalyzing: (isAnalyzing: boolean) => void
  setResult: (result: any) => void
  reset: () => void
}

export const useTextStore = create<TextState>((set) => ({
  text: '',
  isAnalyzing: false,
  result: null,
  setText: (text) => set({ text }),
  setIsAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
  setResult: (result) => set({ result }),
  reset: () => set({ text: '', isAnalyzing: false, result: null }),
}))
