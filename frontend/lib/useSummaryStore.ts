import { create } from 'zustand'
import { Summary } from '../types/summary'

interface SummaryStore {
  summary: Summary | null
  pdfFile: File | null
  setSummary: (summary: Summary) => void
  setPdfFile: (file: File) => void
  clear: () => void
}

export const useSummaryStore = create<SummaryStore>((set) => ({
  summary: null,
  pdfFile: null,
  setSummary: (summary) => set({ summary }),
  setPdfFile: (file) => set({ pdfFile: file }),
  clear: () => set({ summary: null, pdfFile: null }),
}))
