import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, MessageCircle, Tag, Sparkles, Heart, Palette } from 'lucide-react'
import { productAPI, API_BASE } from '../services/api'
import OtpModal from '../components/OtpModal'
import { useOtpAuth } from '../context/OtpAuthContext'
const CATEGORY_LABEL = { jute: 'Jute Bag', tote: 'Tote Bag', wedding: 'Wedding Bag' }

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isVerified } = useOtpAuth()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [showOtpModal, setShowOtpModal] = useState(false)

  const handleCustomize = () => {
    if (isVerified) {
      navigate(`/customize/${id}`)
    } else {
      setShowOtpModal(true)
    }
  }

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await productAPI.getOne(id)
        setProduct(res.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  if (loading) return (
    <div className="pt-24 pb-16 bg-cream min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="skeleton aspect-square rounded-2xl" />
          <div className="flex flex-col gap-4">
            <div className="skeleton h-[40px] w-3/4 rounded-lg" />
            <div className="skeleton h-[20px] w-1/4 rounded-lg" />
            <div className="skeleton h-[150px] w-full rounded-lg" />
            <div className="skeleton h-[100px] w-full rounded-xl mt-6" />
          </div>
        </div>
      </div>
    </div>
  )

  if (!product) return (
    <div className="py-[150px] text-center bg-cream min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl text-text-secondary font-display font-bold">Product not found</h2>
      <Link to="/products" className="btn btn-primary mt-6">
        Back to Products
      </Link>
    </div>
  )

  const images = product.images?.length
    ? product.images.map(i => `${API_BASE}${i}`)
    : ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80']

  return (
    <div className="min-h-screen bg-cream pt-[100px] pb-[80px]">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[0.82rem] font-medium mb-10 overflow-x-auto whitespace-nowrap pb-2">
          <Link to="/" className="text-text-muted transition-colors hover:text-gold-dark uppercase tracking-[1px]">Home</Link>
          <span className="text-text-muted/50 mx-1">/</span>
          <Link to="/products" className="text-text-muted transition-colors hover:text-gold-dark uppercase tracking-[1px]">Products</Link>
          <span className="text-text-muted/50 mx-1">/</span>
          <span className="text-text-primary uppercase tracking-[1px]">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square bg-white rounded-2xl overflow-hidden border border-border group shadow-sm">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full  transition-transform duration-500 group-hover:scale-105" />
              {product.isNew && <div className="absolute top-5 left-0 z-10 bg-gradient-to-r from-gold to-gold-dark text-white text-[0.7rem] font-bold uppercase tracking-[1.5px] py-1.5 px-4 rounded-r-lg shadow-md">New Arrival</div>}
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-text-primary flex items-center justify-center opacity-0 -translate-x-2 transition-all duration-300 shadow-md hover:bg-white hover:text-gold-dark group-hover:opacity-100 group-hover:translate-x-0"
                    onClick={() => setActiveImg(i => (i - 1 + images.length) % images.length)}
                  ><ChevronLeft size={20} /></button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-text-primary flex items-center justify-center opacity-0 translate-x-2 transition-all duration-300 shadow-md hover:bg-white hover:text-gold-dark group-hover:opacity-100 group-hover:translate-x-0"
                    onClick={() => setActiveImg(i => (i + 1) % images.length)}
                  ><ChevronRight size={20} /></button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    className={`shrink-0 w-[80px] h-[80px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${i === activeImg ? 'border-gold shadow-md shadow-gold/20 scale-100 opacity-100' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-95'}`}
                    onClick={() => setActiveImg(i)}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col animate-fade-up">
            <div className="inline-block px-3.5 py-1.5 bg-gold/15 text-gold-dark rounded-md text-[0.75rem] font-bold uppercase tracking-[1.5px] w-fit mb-4">
              {CATEGORY_LABEL[product.category] || product.category}
            </div>

            <h1 className="font-display text-[clamp(2rem,4vw,2.8rem)] font-bold text-text-primary leading-[1.2] mb-5">{product.name}</h1>

            {(product.isNew || product.featured) && (
              <div className="flex gap-2.5 mb-6">
                {product.isNew && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#e74c5e]/10 to-[#e74c5e]/5 text-[#e74c5e] rounded-md text-[0.7rem] font-bold uppercase tracking-[1px] border border-[#e74c5e]/20">
                    <Sparkles size={12} /> New Arrival
                  </span>
                )}
                {product.featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-[#2ecc71]/10 to-[#2ecc71]/5 text-[#27ae60] rounded-md text-[0.7rem] font-bold uppercase tracking-[1px] border border-[#2ecc71]/20">
                    Featured
                  </span>
                )}
              </div>
            )}

            {product.description && (
              <div className="mb-8 pt-6 border-t border-border">
                <h3 className="font-sans text-[0.95rem] font-bold text-text-primary uppercase tracking-[1px] mb-3">About This Product</h3>
                <p className="text-[1rem] text-text-secondary leading-[1.8]">{product.description}</p>
              </div>
            )}

            {product.tags?.length > 0 && (
              <div className="flex items-center gap-2.5 mb-8 flex-wrap">
                <Tag size={16} className="text-text-muted" />
                {product.tags.map(t => <span key={t} className="inline-block px-3 py-1.5 bg-white border border-border rounded-md text-[0.78rem] font-medium text-text-secondary capitalize">{t}</span>)}
              </div>
            )}

          {/* Customize Button for Tote Bags */}
            {product.category === 'tote' && (
              <div className="mb-6">
                <button
                  onClick={handleCustomize}
                  className="btn w-full justify-center text-[0.95rem] bg-gradient-to-br from-[#2c1a0e] to-[#6b4423] text-[#e8d5b7] hover:from-[#3d2510] hover:to-[#8b5e3c] hover:-translate-y-0.5 hover:shadow-[0_12px_40px_rgba(107,68,35,0.35)] border border-[rgba(201,168,76,0.3)] shadow-warm"
                >
                  <Palette size={18} className="text-gold" />
                  <span>✦ Customize This Bag</span>
                </button>
                <p className="text-center text-[0.75rem] text-text-muted mt-2">Upload your logo or artwork · Mobile verification required</p>
              </div>
            )}

            <div className="bg-gradient-to-br from-[#faf6ef] to-[#f5ede0] border border-gold/30 rounded-2xl p-6 shadow-sm mb-8 mt-auto">
              <div className="flex items-center gap-3 mb-3 text-gold-dark">
                <Heart size={18} />
                <h3 className="font-sans text-[1.05rem] font-semibold">Interested in This Product?</h3>
              </div>
              <p className="text-[0.9rem] text-text-secondary leading-[1.6] mb-5">We don't sell online. Reach out to us for pricing, availability, and custom orders.</p>
              <Link
                to={`/contact?product=${product.id}&name=${encodeURIComponent(product.name)}`}
                className="btn btn-primary w-full justify-center text-[0.95rem]"
              >
                <MessageCircle size={16} /> Send Enquiry for This Product
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 pt-5 border-t border-border text-[0.85rem] text-text-secondary">
              <span>
                Category: <strong className="text-text-primary font-semibold">{CATEGORY_LABEL[product.category] || product.category}</strong>
              </span>
              <span className="hidden sm:block w-1 h-1 rounded-full bg-border" />
              <span>
                Added: <strong className="text-text-primary font-semibold">{new Date(product.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => setShowOtpModal(false)}
        onVerified={() => {
          setShowOtpModal(false)
          navigate(`/customize/${id}`)
        }}
      />
    </div>
  )
}
