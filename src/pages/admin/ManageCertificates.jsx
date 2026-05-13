import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Trash2, Award, CheckCircle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function ManageCertificates() {
  const [certs, setCerts] = useState([])
  const [form, setForm] = useState({ title: '', issuer: '', issued_date: '', credential_url: '', image_url: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const fetchCerts = async () => {
    const { data } = await supabase.from('certificates').select('*').order('issued_date', { ascending: false })
    setCerts(data || [])
  }

  useEffect(() => { fetchCerts() }, [])

  const handleAdd = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('certificates').insert([{
      title: form.title,
      issuer: form.issuer,
      issued_date: form.issued_date || null,
      credential_url: form.credential_url || null,
      image_url: form.image_url || null,
    }])
    if (!error) {
      setForm({ title: '', issuer: '', issued_date: '', credential_url: '', image_url: '' })
      setSaved(true)
      fetchCerts()
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  const handleDelete = async (id) => {
    if (!confirm('Hapus sertifikat ini?')) return
    await supabase.from('certificates').delete().eq('id', id)
    fetchCerts()
  }

  const fields = [
    { key: 'title', label: 'Judul Sertifikat', placeholder: 'Web Development Bootcamp', required: true },
    { key: 'issuer', label: 'Penerbit', placeholder: 'Dicoding, Coursera, dll.', required: true },
    { key: 'issued_date', label: 'Tanggal', placeholder: '', required: false, type: 'date' },
    { key: 'credential_url', label: 'URL Kredensial', placeholder: 'https://...', required: false },
    { key: 'image_url', label: 'URL Gambar', placeholder: 'https://...', required: false },
  ]

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <p className="text-sm font-bold text-sky-200">Achievements</p>
        <h1 className="mt-1 flex items-center gap-2 font-display text-3xl font-extrabold text-white">
          <Award size={24} className="text-amber-200" /> Sertifikat
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bento-card p-5">
          <h2 className="mb-4 font-display text-lg font-bold text-white">Tambah Sertifikat</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-xs font-bold text-slate-500">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required={f.required}
                  className="w-full px-3 py-2.5 text-sm"
                />
              </div>
            ))}
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 rounded-lg bg-sky-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition-colors hover:bg-sky-300 disabled:opacity-50"
              >
                <Plus size={13} /> Simpan
              </button>
              {saved && <span className="flex items-center gap-1 text-xs font-bold text-emerald-300"><CheckCircle size={12} /> Tersimpan!</span>}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bento-card overflow-hidden">
          <div className="border-b border-white/10 p-4">
            <p className="text-xs font-bold text-slate-500">{certs.length} sertifikat</p>
          </div>
          {certs.length === 0 ? (
            <div className="p-8 text-center text-sm font-semibold text-slate-500">Belum ada sertifikat</div>
          ) : (
            <ul>
              {certs.map((cert) => (
                <li key={cert.id} className="flex items-center justify-between border-b border-white/10 p-4 transition-colors hover:bg-white/[0.03]">
                  <div>
                    <p className="text-sm font-bold text-white">{cert.title}</p>
                    <p className="mt-0.5 text-xs font-semibold text-slate-500">{cert.issuer}</p>
                  </div>
                  <button onClick={() => handleDelete(cert.id)} className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-300">
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      </div>
    </div>
  )
}
