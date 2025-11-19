import { useEffect, useState } from 'react'
import { LockKeyhole, LogIn } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function AdminAuth({ token, setToken }) {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [info, setInfo] = useState('')

  const login = async (e) => {
    e.preventDefault()
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (!res.ok) throw new Error(await res.text())
      const data = await res.json()
      setToken(data.token)
      localStorage.setItem('cert_token', data.token)
    } catch (e) {
      setInfo(String(e))
    }
  }

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 text-white">
      <div className="flex items-center gap-2 text-white/90 mb-3 font-medium"><LockKeyhole className="w-4 h-4"/> Admin Login</div>
      <form onSubmit={login} className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-white/70 mb-1">Username</label>
          <input value={username} onChange={(e)=>setUsername(e.target.value)} className="w-full bg-slate-900 text-white rounded-md px-3 py-2 border border-slate-700"/>
        </div>
        <div>
          <label className="block text-xs text-white/70 mb-1">Password</label>
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-slate-900 text-white rounded-md px-3 py-2 border border-slate-700"/>
        </div>
        <div className="col-span-2">
          <button className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-md inline-flex items-center gap-2"><LogIn className="w-4 h-4"/> Login</button>
        </div>
      </form>
      {info && <div className="text-xs text-red-400 mt-2">{info}</div>}
      <p className="text-xs text-white/50 mt-3">Tip: Seed an initial admin if needed using the button below.</p>
      <SeedAdmin setUsername={setUsername} setPassword={setPassword} />
    </div>
  )
}

function SeedAdmin({ setUsername, setPassword }) {
  const [done, setDone] = useState(false)
  const onSeed = async () => {
    const form = new FormData()
    form.append('username', 'admin')
    form.append('password', 'admin123')
    const res = await fetch(`${API_BASE}/setup/seed-admin`, { method: 'POST', body: form })
    if (res.ok) {
      setDone(true)
      setUsername('admin')
      setPassword('admin123')
    }
  }
  return (
    <div className="mt-3">
      <button onClick={onSeed} className="text-xs text-white/70 underline">Seed default admin</button>
      {done && <span className="ml-2 text-green-400 text-xs">Done</span>}
    </div>
  )
}
