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
    <div className="p-8">
      <h1 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
        <Award size={20} className="text-emerald-500" /> Sertifikat
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bento-card p-5">
          <h2 className="font-mono text-xs text-emerald-500 mb-4">// Tambah Sertifikat</h2>
          <form onSubmit={handleAdd} className="flex flex-col gap-3">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="font-mono text-xs text-[#444] mb-1 block">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  required={f.required}
                  className="w-full bg-[#0a0a0a] border border-[#1a1a1a] rounded-xl px-3 py-2 font-mono text-sm text-white placeholder-[#333] focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            ))}
            <div className="flex items-center gap-3 mt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-black font-mono text-xs font-bold rounded-xl hover:bg-emerald-400 transition-colors disabled:opacity-50"
              >
                <Plus size={13} /> Simpan
              </button>
              {saved && <span className="flex items-center gap-1 font-mono text-xs text-emerald-500"><CheckCircle size={12} /> Tersimpan!</span>}
            </div>
          </form>
        </div>

        {/* List */}
        <div className="bento-card overflow-hidden">
          <div className="p-4 border-b border-[#0f0f0f]">
            <p className="font-mono text-xs text-[#444]">{certs.length} sertifikat</p>
          </div>
          {certs.length === 0 ? (
            <div className="p-8 text-center font-mono text-sm text-[#333]">Belum ada sertifikat</div>
          ) : (
            <ul>
              {certs.map((cert) => (
                <li key={cert.id} className="flex items-center justify-between p-4 border-b border-[#0a0a0a] hover:bg-[#0a0a0a] transition-colors">
                  <div>
                    <p className="font-mono text-sm text-white">{cert.title}</p>
                    <p className="font-mono text-xs text-[#333] mt-0.5">{cert.issuer}</p>
                  </div>
                  <button onClick={() => handleDelete(cert.id)} className="p-1.5 text-[#333] hover:text-red-500 transition-colors">
                    <Trash2 size={14} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
