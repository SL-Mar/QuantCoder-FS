'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFloppyDisk,
  faCopy,
  faCheckCircle,
  faMagic,
} from '@fortawesome/free-solid-svg-icons'
import MarkdownRenderer from './MarkdownRenderer'
import { useSummaryStore } from '../lib/useSummaryStore'

interface SummaryViewerProps {
  extractSummary: () => void
  saveSummary: () => void
  isLoading: boolean
}

export default function SummaryViewer({
  extractSummary,
  saveSummary,
  isLoading,
}: SummaryViewerProps) {
  const router = useRouter()

  const summary = useSummaryStore((state) => state.summary)
  const pdfFile = useSummaryStore((state) => state.pdfFile)

  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary.summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  const handleSave = () => {
    saveSummary()
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  const handleCode = () => {
    if (summary) {
      router.push('/chat?source=summary')
    }
  }

  return (
    <div className="w-full h-full bg-gray-800 rounded-xl overflow-hidden flex flex-col gap-4">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-4">
        {summary ? (
          <>
            <h3 className="text-sm font-semibold text-indigo-400 break-words">
              📄 {summary.filename}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                disabled={isLoading}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white text-sm font-medium transition ${
                  isLoading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
                <span>Save</span>
              </button>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition"
              >
                <FontAwesomeIcon icon={faCopy} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleCode}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded transition"
              >
                <FontAwesomeIcon icon={faMagic} />
                <span>Code</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-sm">
            {pdfFile ? 'Click extract to generate summary' : 'Summary will appear here'}
          </div>
        )}
      </div>

      {/* Summary Text */}
      <div className="flex-grow overflow-auto px-4 pb-4">
        {summary ? (
          <div className="bg-gray-900 text-gray-100 rounded-md px-6 py-4 text-[0.95rem] font-serif overflow-auto h-full shadow-inner">
            <MarkdownRenderer content={summary.summary} />
          </div>
        ) : (
          pdfFile && (
            <div className="text-center text-gray-500 flex-grow flex items-center justify-center">
              Select extract to generate summary
            </div>
          )
        )}
      </div>

      {/* Toast */}
      {saved && (
        <div className="absolute bottom-4 right-4 bg-green-600 text-white px-3 py-1 text-sm rounded shadow-lg flex items-center gap-2">
          <FontAwesomeIcon icon={faCheckCircle} />
          <span>Summary saved</span>
        </div>
      )}
    </div>
  )
}

