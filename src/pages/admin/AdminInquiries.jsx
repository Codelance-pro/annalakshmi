import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Package, Search, Image as ImageIcon, ExternalLink, MessageCircle, X } from 'lucide-react'
import { inquiryAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUrl'

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [modalImage, setModalImage] = useState(null)

  const load = () => {
    inquiryAPI.getAll().then(r => setInquiries(r.data)).catch(console.error).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const filtered = inquiries.filter(i =>
    search === '' ||
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.email && i.email.toLowerCase().includes(search.toLowerCase())) ||
    (i.phone && i.phone.toLowerCase().includes(search.toLowerCase())) ||
    (i.message && i.message.toLowerCase().includes(search.toLowerCase()))
  )

  const getCleanPhone = (phone) => {
    if (!phone) return ''
    const digits = phone.replace(/\D/g, '')
    if (digits.length === 10) return `91${digits}`
    return digits
  }

  return (
    <div>
      <h1 className="font-display text-[2rem] font-bold text-text-primary mb-1 tracking-tight">Inquiries</h1>
      <p className="text-[0.95rem] text-text-secondary mb-8">Customer enquiries, sample image uploads, and product reference requests.</p>

      <div className="bg-white rounded-2xl border border-[#e1e8ed] shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e1e8ed] flex items-center justify-between flex-wrap gap-4 bg-[#fafbfc]">
          <div className="font-sans text-[1.05rem] font-bold text-text-primary">{inquiries.length} Total Inquiries</div>
          <div className="relative min-w-[240px]">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              className="w-full bg-white border border-[#e1e8ed] rounded-lg py-2 pl-9 pr-3 text-[0.85rem] text-text-primary transition-colors focus:outline-none focus:border-[#3498db] focus:ring-2 focus:ring-[#3498db]/20 h-[36px]"
              placeholder="Search by name, phone, message..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="p-6 flex flex-col gap-3">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-[80px] rounded-xl" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center">
            <Mail size={40} className="opacity-20 mb-3" />
            <p>{search ? 'No inquiries match your search.' : 'No inquiries yet.'}</p>
          </div>
        ) : (
          <div className="flex flex-col">
            {filtered.map(inq => {
              const sampleImg = inq.sampleImage ? getImageUrl(inq.sampleImage) : null
              const cleanPhone = getCleanPhone(inq.phone)

              return (
                <div
                  key={inq.id}
                  className={`border-b border-[#e1e8ed] last:border-b-0 transition-colors ${expanded === inq.id ? 'bg-[#fafbfc]' : 'hover:bg-[#fafbfc]'}`}
                >
                  <div 
                    className="px-6 py-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer" 
                    onClick={() => setExpanded(expanded === inq.id ? null : inq.id)}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3498db] to-[#2980b9] text-white flex items-center justify-center font-bold text-[1.1rem] shrink-0 shadow-sm">
                        {inq.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold text-[0.95rem] text-text-primary mb-1 flex items-center gap-2">
                          <span>{inq.name}</span>
                          {sampleImg && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded text-[0.7rem] font-bold">
                              <ImageIcon size={11} /> Sample Image
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[0.8rem] text-text-secondary flex-wrap">
                          {inq.phone && <span className="flex items-center gap-1.5 font-medium text-text-primary"><Phone size={12} className="text-emerald-600" />{inq.phone}</span>}
                          {inq.email && <span className="flex items-center gap-1.5"><Mail size={12} />{inq.email}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 md:flex-col md:items-end shrink-0 pl-14 md:pl-0">
                      {inq.productId && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#2ecc71]/10 text-[#27ae60] rounded-md text-[0.7rem] font-bold uppercase tracking-[1px] border border-[#2ecc71]/20">
                          <Package size={12} /> Product Inquiry
                        </span>
                      )}
                      <div className="flex items-center gap-1.5 text-[0.8rem] text-text-muted">
                        <Calendar size={12} />
                        {new Date(inq.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  </div>

                  {expanded === inq.id && (
                    <div className="px-6 pb-6 pl-6 sm:pl-[88px]">
                      <div className="bg-white border border-[#e1e8ed] rounded-xl p-5 shadow-sm">
                        {/* Sample image view */}
                        {sampleImg && (
                          <div className="mb-5 p-4 bg-[#f8f9fa] border border-[#e1e8ed] rounded-xl">
                            <label className="block text-[0.75rem] font-bold uppercase tracking-[1px] text-amber-800 mb-3 flex items-center gap-2">
                              <ImageIcon size={14} /> Uploaded Sample / Reference Image
                            </label>
                            <div className="flex items-start gap-4 flex-wrap">
                              <div
                                className="relative group cursor-pointer border border-[#e1e8ed] rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
                                onClick={() => setModalImage(sampleImg)}
                              >
                                <img
                                  src={sampleImg}
                                  alt="Customer sample reference"
                                  className="w-36 h-36 object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                                  Click to view
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 pt-2">
                                <button
                                  type="button"
                                  onClick={() => setModalImage(sampleImg)}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e1e8ed] rounded-lg text-[0.8rem] font-semibold text-text-primary hover:bg-[#f1f3f5] transition-colors"
                                >
                                  <ImageIcon size={14} /> View Large Image
                                </button>
                                <a
                                  href={sampleImg}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e1e8ed] rounded-lg text-[0.8rem] font-semibold text-[#3498db] hover:bg-[#f1f3f5] transition-colors"
                                >
                                  <ExternalLink size={14} /> Open Cloudinary URL
                                </a>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mb-4">
                          <label className="block text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted mb-2">Message / Requirements</label>
                          <p className="text-[0.95rem] text-text-secondary leading-[1.6] whitespace-pre-wrap">{inq.message || 'No additional text message provided.'}</p>
                        </div>
                        {inq.productId && (
                          <div className="mb-4">
                            <label className="block text-[0.75rem] font-bold uppercase tracking-[1px] text-text-muted mb-2">Product ID</label>
                            <code className="bg-[#f8f9fa] border border-[#e1e8ed] px-2 py-1 rounded text-[0.8rem] text-[#e67e22]">{inq.productId}</code>
                          </div>
                        )}
                        <div className="flex items-center gap-3 pt-4 border-t border-[#e1e8ed] flex-wrap">
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-lg text-[0.85rem] font-semibold shadow-sm transition-colors hover:bg-[#20ba5a]"
                            >
                              <MessageCircle size={16} /> WhatsApp Customer
                            </a>
                          )}
                          {inq.phone && (
                            <a href={`tel:${inq.phone}`} className="inline-flex items-center gap-2 px-4 py-2 bg-[#f8f9fa] border border-[#e1e8ed] text-text-secondary rounded-lg text-[0.85rem] font-medium transition-colors hover:bg-[#e1e8ed] hover:text-text-primary">
                              <Phone size={14} /> Call {inq.phone}
                            </a>
                          )}
                          {inq.email && (
                            <a href={`mailto:${inq.email}`} className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#3498db] text-[#3498db] rounded-lg text-[0.85rem] font-medium transition-colors hover:bg-[#3498db] hover:text-white">
                              <Mail size={14} /> Reply via Email
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Image Modal Lightbox */}
      {modalImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in"
          onClick={() => setModalImage(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setModalImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <X size={20} />
            </button>
            <img
              src={modalImage}
              alt="Uploaded sample design full size"
              className="max-w-full max-h-[85vh] object-contain rounded-xl mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  )
}
