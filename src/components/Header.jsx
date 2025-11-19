import { useEffect, useState } from 'react'
import { ShieldCheck, LogIn, LogOut } from 'lucide-react'

export default function Header({ token, onLogout }) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur border-b border-slate-700/50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <ShieldCheck className="w-6 h-6 text-blue-400" />
          <span>CertVerify</span>
        </div>
        <div>
          {token ? (
            <button onClick={onLogout} className="text-sm text-white/80 hover:text-white flex items-center gap-2">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          ) : (
            <a href="#admin" className="text-sm text-white/80 hover:text-white flex items-center gap-2">
              <LogIn className="w-4 h-4" /> Admin
            </a>
          )}
        </div>
      </div>
    </header>
  )
}
