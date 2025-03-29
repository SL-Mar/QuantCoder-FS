// pages/chat.tsx

'use client'

import { useEffect, useState } from 'react'
import CanvasView from '../components/CanvasView'

export default function ChatPage() {
  const [summaryText, setSummaryText] = useState<string | null>(null)

  useEffect(() => {
    const text = localStorage.getItem('summaryForCode')
    if (text) setSummaryText(text)
  }, [])

  return (
    <div className="w-full h-screen flex flex-col bg-gray-900 text-white p-4">
      <header className="mb-4 flex justify-between items-center">
        <h1 className="text-xl font-semibold">LLM Coding Canvas</h1>
        <button
          onClick={() => window.history.back()}
          className="text-sm bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          ← Back to Summary
        </button>
      </header>

      <main className="flex-1 overflow-auto">
        <CanvasView />
      </main>
    </div>
  )
}
