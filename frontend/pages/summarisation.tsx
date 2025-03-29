import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../lib/useAuth'
import SummaryViewer from '../components/SummaryViewer'
import SavedSummariesList from '../components/SavedSummariesList'
import { api } from '../lib/api'
import { useSummaryStore } from '../lib/useSummaryStore'

const PDFViewer = dynamic(() => import('../components/PDFViewer'), { ssr: false })

export default function SummariesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  const { pdfFile, summary, setPdfFile, setSummary } = useSummaryStore()
  const [savedSummaries, setSavedSummaries] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && user === null) {
      router.push('/login?next=/summarisation')
    }
  }, [user, loading])

  useEffect(() => {
    if (!loading && user) {
      fetchSummaries()
    }
  }, [loading, user])

  const fetchSummaries = async () => {
    try {
      const data = await api.listSummaries()
      setSavedSummaries(data.summaries)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleExtract = async () => {
    if (!pdfFile) return
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.extractSummary(pdfFile)
      setSummary({ filename: pdfFile.name, summary: data.summary })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!summary) return
    setIsLoading(true)
    setError(null)
    try {
      await api.saveSummary(summary)
      fetchSummaries()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoad = async (filename: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await api.loadSummary(filename)
      setSummary({ filename, summary: data.content })
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (filename: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await api.deleteSummary(filename)
      fetchSummaries()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex w-full h-screen gap-6 bg-[#0f172a] text-white">
      {/* Sidebar */}
      <aside className="w-[260px] bg-gray-900 border-r border-gray-800 p-4 overflow-auto">
        <SavedSummariesList
          summaries={savedSummaries}
          onLoad={handleLoad}
          onDelete={handleDelete}
        />
      </aside>

      {/* Main Panel */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 p-6 overflow-hidden">
        {/* PDF Viewer */}
        <section className="bg-gray-800 rounded-xl shadow-lg overflow-auto h-full p-4">
          <PDFViewer
            selectedFile={pdfFile}
            onFileSelect={setPdfFile}
            onExtractSummary={handleExtract}
            isLoading={isLoading}
          />
        </section>

        {/* Summary Viewer */}
        <section className="bg-gray-800 rounded-xl shadow-lg overflow-auto h-full p-4 flex flex-col">
          <SummaryViewer
            extractSummary={handleExtract}
            saveSummary={handleSave}
            isLoading={isLoading}
          />
          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-800 rounded text-sm">
              {error}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
