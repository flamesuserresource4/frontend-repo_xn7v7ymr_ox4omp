import { useEffect, useMemo, useState } from 'react'
import { PlusCircle, Trash2, Pencil, Save, X } from 'lucide-react'

const API_BASE = import.meta.env.VITE_BACKEND_URL || ''

export default function AdminDashboard({ token }) {
  const [items, setItems] = useState([])
  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    code: '', recipient_name: '', course_name: '', issuer: '', issue_date: '', expiry_date: '', grade: '', notes: '', file: null
  })
  const [editing, setEditing] = useState(null)

  const headers = useMemo(() => token ? { 'Authorization': `Bearer ${token}` } : {}, [token])

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/certificates?q=${encodeURIComponent(q)}&page=${page}&limit=10`)
      const data = await res.json()
      setItems(data.items)
      setTotal(data.total)
    } catch (e) {
      console.error(e)
    } finally { setLoading(false) }
  }

  useEffect(() => { load() }, [q, page])

  const onCreate = async (e) => {
    e.preventDefault()
    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => {
      if (v !== null && v !== '') {
        if (k === 'file' && v) fd.append('file', v)
        else fd.append(k, v)
      }
    })
    const res = await fetch(`${API_BASE}/certificates`, { method: 'POST', headers, body: fd })
    if (!res.ok) {
      const msg = await res.text()
      alert(`Create failed: ${msg}`)
      return
    }
    setForm({ code: '', recipient_name: '', course_name: '', issuer: '', issue_date: '', expiry_date: '', grade: '', notes: '', file: null })
    load()
  }

  const onDelete = async (id) => {
    if (!confirm('Delete this certificate?')) return
    const res = await fetch(`${API_BASE}/certificates/${id}`, { method: 'DELETE', headers })
    if (!res.ok) alert('Delete failed')
    load()
  }

  const onUpdate = async (e) => {
    e.preventDefault()
    if (!editing) return
    const fd = new FormData()
    Object.entries(editing).forEach(([k, v]) => {
      if (['id', 'code', 'created_at', 'updated_at'].includes(k)) return
      if (v !== undefined && v !== null) {
        if (k === 'file') fd.append('file', v)
        else fd.append(k, v)
      }
    })
    const res = await fetch(`${API_BASE}/certificates/${editing.id}`, { method: 'PUT', headers, body: fd })
    if (!res.ok) alert('Update failed')
    setEditing(null)
    load()
  }

  return (
    <div id="admin" className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Admin Dashboard</h3>

      {!token && (
        <div className="text-sm text-white/70 mb-4">Login as admin to create, update, or delete certificates.</div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={onCreate} className="space-y-3">
          <div className="font-medium">Create Certificate</div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Code" value={form.code} onChange={(v) => setForm({ ...form, code: v })} required />
            <Input label="Recipient" value={form.recipient_name} onChange={(v) => setForm({ ...form, recipient_name: v })} required />
            <Input label="Course" value={form.course_name} onChange={(v) => setForm({ ...form, course_name: v })} required />
            <Input label="Issuer" value={form.issuer} onChange={(v) => setForm({ ...form, issuer: v })} required />
            <Input label="Issue Date" type="date" value={form.issue_date} onChange={(v) => setForm({ ...form, issue_date: v })} required />
            <Input label="Expiry Date" type="date" value={form.expiry_date} onChange={(v) => setForm({ ...form, expiry_date: v })} />
            <Input label="Grade" value={form.grade} onChange={(v) => setForm({ ...form, grade: v })} />
            <Input label="Notes" value={form.notes} onChange={(v) => setForm({ ...form, notes: v })} />
            <div className="col-span-2">
              <label className="block text-xs text-white/70 mb-1">File</label>
              <input type="file" onChange={(e) => setForm({ ...form, file: e.target.files?.[0] || null })} className="block w-full text-sm text-white/80" />
            </div>
          </div>
          <button disabled={!token} className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 rounded-md inline-flex items-center gap-2"><PlusCircle className="w-4 h-4"/> Create</button>
        </form>

        <div>
          <div className="flex items-center gap-3 mb-3">
            <input className="flex-1 bg-slate-900 text-white rounded-lg px-3 py-2 border border-slate-700" placeholder="Search..." value={q} onChange={(e)=>setQ(e.target.value)} />
            <div className="text-sm text-white/60">{total} total</div>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-auto pr-1">
            {items.map((it) => (
              <div key={it.id} className="bg-slate-900 border border-slate-700 rounded-lg p-3">
                {editing?.id === it.id ? (
                  <EditItem item={editing} setItem={setEditing} onCancel={() => setEditing(null)} onSave={onUpdate} />
                ) : (
                  <div className="grid grid-cols-6 gap-2 items-center">
                    <div className="col-span-2">
                      <div className="font-medium">{it.recipient_name}</div>
                      <div className="text-xs text-white/60">{it.course_name}</div>
                      <div className="text-xs text-white/40">Code: {it.code}</div>
                    </div>
                    <div className="text-sm">{new Date(it.issue_date).toLocaleDateString()}</div>
                    <div className="text-sm">{it.issuer}</div>
                    <div className="text-sm">{it.grade || '-'}{it.file_url && <a className="ml-2 text-blue-400 hover:underline" href={`${API_BASE}${it.file_url}`} target="_blank">File</a>}</div>
                    <div className="flex justify-end gap-2">
                      <button disabled={!token} onClick={() => setEditing(it)} className="px-2 py-1 rounded-md bg-slate-700/70 hover:bg-slate-700 disabled:opacity-50"><Pencil className="w-4 h-4"/></button>
                      <button disabled={!token} onClick={() => onDelete(it.id)} className="px-2 py-1 rounded-md bg-red-600/80 hover:bg-red-600 disabled:opacity-50 text-white"><Trash2 className="w-4 h-4"/></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center mt-3">
            <button onClick={() => setPage((p)=>Math.max(1,p-1))} className="px-3 py-1 bg-slate-700 rounded">Prev</button>
            <div className="text-sm">Page {page}</div>
            <button onClick={() => setPage((p)=>p+1)} className="px-3 py-1 bg-slate-700 rounded">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Input({ label, value, onChange, type='text', required }) {
  return (
    <div>
      <label className="block text-xs text-white/70 mb-1">{label}</label>
      <input required={required} value={value} onChange={(e)=>onChange(e.target.value)} type={type} className="w-full bg-slate-900 text-white rounded-md px-3 py-2 border border-slate-700"/>
    </div>
  )
}

function EditItem({ item, setItem, onCancel, onSave }) {
  return (
    <form onSubmit={onSave} className="grid grid-cols-6 gap-2 items-end">
      <div className="col-span-2">
        <Input label="Recipient" value={item.recipient_name} onChange={(v)=>setItem({ ...item, recipient_name: v })} />
        <div className="text-xs text-white/40 mt-1">Code: {item.code}</div>
      </div>
      <Input label="Course" value={item.course_name} onChange={(v)=>setItem({ ...item, course_name: v })} />
      <Input label="Issuer" value={item.issuer} onChange={(v)=>setItem({ ...item, issuer: v })} />
      <Input label="Grade" value={item.grade || ''} onChange={(v)=>setItem({ ...item, grade: v })} />
      <div>
        <label className="block text-xs text-white/70 mb-1">File</label>
        <input type="file" onChange={(e)=>setItem({ ...item, file: e.target.files?.[0] })} className="text-sm" />
      </div>
      <div className="col-span-6 flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-3 py-1 bg-slate-700 rounded inline-flex items-center gap-2"><X className="w-4 h-4"/> Cancel</button>
        <button className="px-3 py-1 bg-green-600 rounded inline-flex items-center gap-2 text-white"><Save className="w-4 h-4"/> Save</button>
      </div>
    </form>
  )
}
