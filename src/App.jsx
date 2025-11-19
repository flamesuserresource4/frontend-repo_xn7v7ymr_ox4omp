import { useEffect, useState } from 'react'
import Header from './components/Header'
import VerifyForm from './components/VerifyForm'
import AdminDashboard from './components/AdminDashboard'
import AdminAuth from './components/AdminAuth'

function App() {
  const [token, setToken] = useState('')

  useEffect(() => {
    const t = localStorage.getItem('cert_token')
    if (t) setToken(t)
  }, [])

  const logout = () => {
    localStorage.removeItem('cert_token')
    setToken('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header token={token} onLogout={logout} />
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <section>
          <h1 className="text-3xl font-bold mb-3">Verify a Certificate</h1>
          <p className="text-white/70 mb-4">Enter a public code to confirm authenticity and view details.</p>
          <VerifyForm />
        </section>

        <section className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <AdminAuth token={token} setToken={setToken} />
          </div>
          <div className="md:col-span-2">
            <AdminDashboard token={token} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
