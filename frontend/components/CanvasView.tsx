'use client'

import { useSummaryStore } from '../lib/useSummaryStore'

export default function CanvasView() {
  const summaryText = useSummaryStore((state) => state.summary?.summary)

  if (!summaryText) {
    return (
      <div className="text-gray-400 text-center mt-20">
        No summary available. Please extract a summary first.
      </div>
    )
  }

  return (
    <div className="flex h-full w-full gap-4">
      {/* Summary Preview Panel */}
      <div className="w-1/2 bg-gray-800 rounded-lg p-4 overflow-auto border border-gray-700 shadow-inner">
        <h2 className="text-indigo-400 text-lg font-bold mb-4">📄 Summary</h2>
        <pre className="whitespace-pre-wrap text-gray-100 text-sm font-mono bg-gray-900 p-4 rounded border border-gray-700">
          {summaryText}
        </pre>
      </div>

      {/* Code / Reasoning Panel */}
      <div className="w-1/2 bg-gray-800 rounded-lg p-4 overflow-auto border border-gray-700 shadow-inner">
        <h2 className="text-indigo-400 text-lg font-bold mb-4">🧠 LLM Output</h2>
        <div className="text-gray-400 text-sm italic">
          This will display LLM reasoning, steps, or generated code here...
        </div>
      </div>
    </div>
  )
}
