import { useState } from 'react'
import { Search } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function VerifyForm() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await fetch(`${API_BASE}/certificates/${encodeURIComponent(code)}`)
      if (!res.ok) throw new Error('Certificate not found')
      const data = await res.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
      <form onSubmit={onSubmit} className="flex gap-3">
        <input
          className="flex-1 bg-slate-900 text-white rounded-lg px-4 py-3 outline-none border border-slate-700 focus:border-blue-500"
          placeholder="Enter certificate code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-3 rounded-lg flex items-center gap-2 disabled:opacity-60"
        >
          <Search className="w-4 h-4" /> {loading ? 'Checking...' : 'Verify'}
        </button>
      </form>

      {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}

      {result && (
        <div className="mt-6 text-white/90">
          <div className="grid sm:grid-cols-2 gap-4">
            <Info label="Code" value={result.code} />
            <Info label="Recipient" value={result.recipient_name} />
            <Info label="Course" value={result.course_name} />
            <Info label="Issuer" value={result.issuer} />
            <Info label="Issued On" value={new Date(result.issue_date).toDateString()} />
            <Info label="Expiry" value={result.expiry_date ? new Date(result.expiry_date).toDateString() : 'N/A'} />
            {result.grade && <Info label="Grade" value={result.grade} />}
          </div>
          {result.file_url && (
            <a href={`${API_BASE}${result.file_url}`} target="_blank" className="inline-block mt-4 text-blue-400 hover:underline">View file</a>
          )}
        </div>
      )}
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div>
      <div className="text-xs text-white/50">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
