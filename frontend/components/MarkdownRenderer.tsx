'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function MarkdownRenderer({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl text-indigo-400 font-bold mt-4 mb-2" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl text-indigo-300 font-semibold mt-3 mb-2" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg text-indigo-200 font-medium mt-2 mb-1" {...props} />
        ),
        p: ({ node, ...props }) => (
          <p className="text-gray-100 leading-relaxed mb-3" {...props} />
        ),
        ul: ({ node, ...props }) => (
          <ul className="list-disc list-inside mb-4 pl-4" {...props} />
        ),
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
