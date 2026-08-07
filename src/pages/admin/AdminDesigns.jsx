import { useState, useEffect } from 'react'
import { Search, Download, Eye, RefreshCw, Palette, Phone, User, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { designAPI } from '../../services/api'

export default function AdminDesigns() {
  const [designs, setDesigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [exporting, setExporting] = useState(false)
  const [preview, setPreview] = useState(null)

  const load = () => {
    setLoading(true)
    designAPI
      .getAll()
      .then((r) => {
        const list = Array.isArray(r.data) ? r.data : r.data?.designs || []
        setDesigns(list)
      })
      .catch((err) => {
        console.error(err)
        toast.error('Failed to load designs')
      })
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = designs.filter((d) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      (d.name || '').toLowerCase().includes(q) ||
      (d.mobile || '').toLowerCase().includes(q) ||
      (d.bagId || '').toLowerCase().includes(q) ||
      (d.bagColor || '').toLowerCase().includes(q)
    )
  })

  const handleExport = async () => {
    setExporting(true)
    try {
      const res = await designAPI.downloadExcel()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `designs_${new Date().toISOString().slice(0, 10)}.xlsx`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
      toast.success('Excel downloaded!')
    } catch (err) {
      console.error(err)
      toast.error('Failed to export Excel')
    } finally {
      setExporting(false)
    }
  }

  const colorDot = (color) => {
    const map = {
      natural: '#f5e6c8',
      white: '#ffffff',
      black: '#2c3e50',
      red: '#e74c3c',
      blue: '#3498db',
      green: '#27ae60',
      pink: '#e91e8f',
      yellow: '#f1c40f',
    }
    const bg = map[(color || '').toLowerCase()] || '#bdc3c7'
    return (
      <span
        className="inline-block w-4 h-4 rounded-full border border-[#ccc] shrink-0"
        style={{ backgroundColor: bg }}
        title={color}
      />
    )
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div>
      <h1 className="font-display text-[1.5rem] sm:text-[2rem] font-bold text-text-primary mb-1 tracking-tight">
        Saved Designs
      </h1>
      <p className="text-[0.85rem] sm:text-[0.95rem] text-text-secondary mb-6 sm:mb-8">
        View all customer tote-bag customizations.
      </p>

      <div className="bg-white rounded-2xl border border-[#e1e8ed] shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* Toolbar */}
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#e1e8ed] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 bg-[#fafbfc]">
          <div className="flex gap-3 flex-1 flex-wrap items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-0 sm:min-w-[200px] sm:max-w-[300px]">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className="w-full bg-white border border-[#e1e8ed] rounded-lg py-2 pl-9 pr-3 text-[0.85rem] text-text-primary transition-colors focus:outline-none focus:border-[#3498db] focus:ring-2 focus:ring-[#3498db]/20 h-[38px]"
                placeholder="Search by name, mobile…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* Count badge */}
            <span className="text-[0.8rem] text-text-muted font-medium px-3 py-1 bg-[#f0f0f0] rounded-full whitespace-nowrap">
              {filtered.length} design{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          <div className="flex gap-2">
            <button
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-[#e1e8ed] rounded-lg text-[0.85rem] font-medium text-text-secondary transition-colors hover:bg-[#f8f9fa] hover:text-text-primary flex-1 sm:flex-none"
              onClick={load}
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-[#27ae60] text-white rounded-lg text-[0.85rem] font-medium transition-colors hover:bg-[#219a52] disabled:opacity-50 disabled:cursor-not-allowed flex-1 sm:flex-none"
              onClick={handleExport}
              disabled={exporting || designs.length === 0}
            >
              <Download size={15} />
              {exporting ? 'Exporting…' : 'Excel'}
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton h-[100px] rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 sm:p-12 text-center text-text-muted flex flex-col items-center">
            <Palette size={40} className="opacity-20 mb-3" />
            <p className="text-[0.9rem] sm:text-[0.95rem]">
              {search
                ? 'No designs match your search.'
                : 'No saved designs yet. Designs will appear here when customers use the tote-bag designer.'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table — hidden on small screens */}
            <div className="hidden md:block w-full overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#e1e8ed]">
                    <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">#</th>
                    <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Preview</th>
                    <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Customer</th>
                    <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Mobile</th>
                    <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Bag Color</th>
                    <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Created</th>
                    <th className="px-6 py-4 text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted whitespace-nowrap font-sans">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((d, idx) => {
                    const did = d.id || d._id
                    return (
                      <tr key={did} className="border-b border-[#e1e8ed] last:border-b-0 transition-colors hover:bg-[#fafbfc]">
                        <td className="px-6 py-4 text-[0.82rem] text-text-muted">{idx + 1}</td>
                        <td className="px-6 py-4">
                          {d.previewUrl ? (
                            <img
                              src={d.previewUrl}
                              alt="Design preview"
                              className="w-14 h-14 rounded-lg object-cover border border-[#e1e8ed] cursor-pointer transition-transform hover:scale-110"
                              onClick={() => setPreview(d)}
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-lg bg-[#f8f9fa] border border-[#e1e8ed] flex items-center justify-center text-[1.2rem]">🎨</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-text-muted shrink-0" />
                            <span className="font-semibold text-[0.92rem] text-text-primary">{d.name || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Phone size={14} className="text-text-muted shrink-0" />
                            <span className="text-[0.88rem] text-text-secondary">{d.mobile || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {colorDot(d.bagColor)}
                            <span className="text-[0.85rem] text-text-secondary capitalize">{d.bagColor || 'N/A'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <Calendar size={14} className="text-text-muted shrink-0" />
                            <span className="text-[0.82rem] text-text-muted whitespace-nowrap">{formatDate(d.createdAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {d.previewUrl && (
                            <button
                              className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors text-text-secondary hover:bg-[#3498db]/10 hover:text-[#3498db]"
                              onClick={() => setPreview(d)}
                              title="View preview"
                            >
                              <Eye size={15} />
                            </button>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile card view — visible only on small screens */}
            <div className="md:hidden flex flex-col">
              {filtered.map((d, idx) => {
                const did = d.id || d._id
                return (
                  <div
                    key={did}
                    className="border-b border-[#e1e8ed] last:border-b-0 px-4 py-4 transition-colors hover:bg-[#fafbfc]"
                  >
                    <div className="flex items-start gap-3">
                      {/* Preview thumbnail */}
                      {d.previewUrl ? (
                        <img
                          src={d.previewUrl}
                          alt="Design preview"
                          className="w-16 h-16 rounded-xl object-cover border border-[#e1e8ed] cursor-pointer shrink-0"
                          onClick={() => setPreview(d)}
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-[#f8f9fa] border border-[#e1e8ed] flex items-center justify-center text-[1.4rem] shrink-0">
                          🎨
                        </div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-[0.95rem] text-text-primary truncate">
                            {d.name || 'N/A'}
                          </span>
                          <span className="text-[0.7rem] text-text-muted bg-[#f0f0f0] px-2 py-0.5 rounded-full shrink-0 ml-2">
                            #{idx + 1}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-[0.82rem] text-text-secondary mb-1">
                          <Phone size={12} className="text-text-muted shrink-0" />
                          {d.mobile || 'N/A'}
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="flex items-center gap-1.5 text-[0.78rem] text-text-muted">
                            {colorDot(d.bagColor)}
                            <span className="capitalize">{d.bagColor || 'N/A'}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[0.75rem] text-text-muted">
                            <Calendar size={11} className="shrink-0" />
                            {formatDate(d.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      {/* Preview Modal */}
      {preview && (
        <div
          className="fixed inset-0 z-[1100] bg-[#2c3e50]/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
          onClick={() => setPreview(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[520px] shadow-[0_24px_60px_rgba(0,0,0,0.2)] animate-fade-up overflow-hidden max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-[#e1e8ed] flex items-center justify-between">
              <h2 className="font-display text-[1.1rem] sm:text-[1.2rem] font-bold text-text-primary m-0">
                Design Preview
              </h2>
              <button
                className="w-8 h-8 rounded-full bg-[#f8f9fa] flex items-center justify-center text-text-muted transition-colors hover:bg-[#e1e8ed] hover:text-text-primary text-[1.2rem]"
                onClick={() => setPreview(null)}
              >
                ×
              </button>
            </div>
            <div className="p-4 sm:p-6 flex flex-col items-center gap-4 sm:gap-5">
              {preview.previewUrl && (
                <img
                  src={preview.previewUrl}
                  alt="Design"
                  className="w-full max-h-[280px] sm:max-h-[350px] object-contain rounded-xl border border-[#e1e8ed]"
                />
              )}
              <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 text-[0.85rem] sm:text-[0.88rem]">
                <div>
                  <div className="text-text-muted text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[1px] font-semibold mb-1">Customer</div>
                  <div className="text-text-primary font-medium">{preview.name || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-text-muted text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[1px] font-semibold mb-1">Mobile</div>
                  <div className="text-text-primary font-medium">{preview.mobile || 'N/A'}</div>
                </div>
                <div>
                  <div className="text-text-muted text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[1px] font-semibold mb-1">Bag Color</div>
                  <div className="flex items-center gap-2 text-text-primary font-medium capitalize">
                    {colorDot(preview.bagColor)} {preview.bagColor || 'N/A'}
                  </div>
                </div>
                <div>
                  <div className="text-text-muted text-[0.7rem] sm:text-[0.75rem] uppercase tracking-[1px] font-semibold mb-1">Created</div>
                  <div className="text-text-primary font-medium">
                    {preview.createdAt
                      ? new Date(preview.createdAt).toLocaleString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })
                      : '—'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
