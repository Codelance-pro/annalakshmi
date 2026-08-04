import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Sparkles, MessageCircle, ArrowRight, Star } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'
import slide3 from '../assets/slide3.png'

const FEATURES = [
  { icon: '💍', title: 'Bridal Sets', desc: 'Coordinated bag collections for brides and bridesmaids' },
  { icon: '🌸', title: 'Floral Embroidery', desc: 'Delicate hand-stitched floral patterns for elegance' },
  { icon: '🎀', title: 'Personalized', desc: 'Custom monograms and dedications on every bag' },
  { icon: '✨', title: 'Bulk Orders', desc: 'Perfect for wedding favors and trousseau gifts' },
]

export default function Wedding() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productAPI.getAll({ category: 'wedding' })
      .then(res => setProducts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="relative pt-[140px] pb-[100px] bg-[#fdfafb] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,160,199,0.15)_0%,transparent_100%)]" />
        
        {/* Simple falling petals effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className="absolute w-3 h-3 bg-[#e8cadd] rounded-[50%_0_50%_50%] opacity-60 animate-[float_10s_linear_infinite]"
              style={{ left: `${Math.random() * 100}%`, animationDelay: `${i * 0.4}s`, top: '-5%' }} 
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#f5ebeb] border border-[#e8cadd] rounded-full text-[0.75rem] font-bold uppercase tracking-[2px] text-[#b47fa3] mb-6 animate-fade-up">
            <Sparkles size={14} /> Exclusively Curated
          </div>
          
          <h1 className="font-display text-[clamp(2.5rem,5vw,4.2rem)] font-bold text-text-primary leading-[1.15] mb-5 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Elegant <span className="text-[#b47fa3] italic">Wedding Bags</span>
            <br />For Your Perfect Day
          </h1>
          
          <p className="text-[1.1rem] text-text-secondary leading-[1.7] max-w-[640px] mx-auto mb-10 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Handcrafted with love — bespoke jute and tote bags that complement every wedding theme.
            From intimate ceremonies to grand celebrations.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link to="/contact" className="btn bg-gradient-to-r from-[#b47fa3] to-[#8c5e7b] text-white hover:-translate-y-1 shadow-lg shadow-[#b47fa3]/30 border-none">
              <Heart size={16} /> Request Custom Order
            </Link>
            <a href="#wedding-collection" className="inline-flex items-center gap-2 px-6 py-3 text-[#b47fa3] font-medium transition-colors hover:text-[#8c5e7b]">
              Explore Collection <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white py-14 border-y border-[#f5ebeb]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {FEATURES.map(f => (
              <div key={f.title} className="text-center p-6 bg-[#fdfafb] rounded-2xl border border-[#f5ebeb] transition-all hover:-translate-y-1 hover:shadow-md">
                <div className="w-14 h-14 mx-auto bg-white rounded-full flex items-center justify-center text-[1.5rem] shadow-sm mb-4">
                  {f.icon}
                </div>
                <h4 className="font-sans text-[1rem] font-semibold text-text-primary mb-2">{f.title}</h4>
                <p className="text-[0.85rem] text-text-secondary leading-[1.5]">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Collection */}
      <section id="wedding-collection" className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <div className="text-[0.75rem] font-bold uppercase tracking-[2px] text-[#b47fa3] mb-4 flex justify-center items-center gap-1.5"><Star size={13} />Wedding Collection</div>
            <h2 className="font-display text-[2.4rem] font-bold text-text-primary mb-4">Our Bridal Masterpieces</h2>
            <p className="text-[1rem] text-text-secondary leading-[1.6]">Each piece crafted to be as special as the occasion it celebrates.</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="w-12 h-px bg-border" /><span className="w-2 h-2 rotate-45 bg-[#d4a0c7]" /><span className="w-12 h-px bg-border" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-[380px] rounded-2xl" />)}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#f5ebeb] max-w-[600px] mx-auto shadow-sm">
              <div className="text-[3rem] mb-4">💍</div>
              <h3 className="font-display text-[1.5rem] font-bold text-text-primary mb-3">Curating Your Perfect Collection</h3>
              <p className="text-[0.95rem] text-text-secondary mb-6 px-6">Our wedding bag collection is being lovingly curated. Reach out to discuss your custom requirements!</p>
              <Link to="/contact" className="btn bg-[#b47fa3] text-white hover:bg-[#8c5e7b] border-none">
                <MessageCircle size={16} /> Contact Us
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Custom CTA */}
      <section className="py-20 bg-gradient-to-br from-[#b47fa3] to-[#8c5e7b] text-white text-center">
        <div className="container mx-auto px-4 max-w-[800px]">
          <h2 className="font-display text-[2.2rem] font-bold mb-4">Need Something Truly Unique?</h2>
          <p className="text-[1.05rem] text-white/80 leading-[1.6] mb-8">
            We create bespoke wedding bags tailored to your theme, colours, and quantity.
            Minimum order of 20 pieces for custom designs.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/contact" className="btn bg-white text-[#8c5e7b] hover:bg-cream border-none">
              <Heart size={16} /> Start Your Order
            </Link>
            <Link to="/products" className="btn bg-transparent border-2 border-white/30 text-white hover:bg-white/10">
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
