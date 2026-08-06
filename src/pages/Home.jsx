import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Heart, Star, ShoppingBag, Leaf, Award, Truck } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'
import slide1 from '../assets/slide1.jpg'
import slide2 from '../assets/slide2.jpg'
import slide3 from '../assets/slide3.png'

const HERO_SLIDES = [
  {
    id: 1,
    title: 'Handcrafted',
    titleBold: 'Jute Bags',
    subtitle: 'Where tradition meets contemporary elegance — eco-friendly bags for every occasion.',
    badge: '✦ New Arrivals Daily',
    img: slide1,
    cta: '/products?category=jute',
    ctaLabel: 'Explore Jute Collection',
  },
  {
    id: 2,
    title: 'Elegant',
    titleBold: 'Wedding Bags',
    subtitle: 'Bespoke bags crafted for your most special day — a perfect blend of beauty and sentiment.',
    badge: '✦ Exclusively Curated',
    img: slide3,
    cta: '/wedding',
    ctaLabel: 'View Wedding Collection',
  },
  {
    id: 3,
    title: 'Versatile',
    titleBold: 'Tote Bags',
    subtitle: 'Stylish, spacious, and sustainable — tote bags that complement every lifestyle.',
    badge: '✦ Artisan Crafted',
    img: slide2,
    cta: '/products?category=tote',
    ctaLabel: 'Discover Totes',
  },
]

const FEATURES = [
  { icon: Leaf, title: 'Eco Friendly', desc: '100% natural jute & sustainable materials' },
  { icon: Award, title: 'Artisan Made', desc: 'Handcrafted by skilled artisans with care' },
  { icon: Truck, title: 'Pan India Delivery', desc: 'Quick shipping across all Indian states' },
  { icon: Heart, title: 'Custom Orders', desc: 'Personalised designs for bulk & weddings' },
]

export default function Home() {
  const [slide, setSlide] = useState(0)
  const [newProducts, setNewProducts] = useState([])
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const intervalRef = useRef(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
    return () => clearInterval(intervalRef.current)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [newRes, featuredRes] = await Promise.all([
          productAPI.getAll({ latest: true }),
          productAPI.getAll({ featured: true }),
        ])
        const newArr = Array.isArray(newRes.data) ? newRes.data : newRes.data?.products || []
        const featArr = Array.isArray(featuredRes.data) ? featuredRes.data : featuredRes.data?.products || []
        setNewProducts(newArr.slice(0, 4))
        setFeaturedProducts(featArr.slice(0, 6))
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const goToSlide = (i) => {
    clearInterval(intervalRef.current)
    setSlide(i)
    intervalRef.current = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000)
  }

  const current = HERO_SLIDES[slide]

  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-screen min-h-[600px] max-h-[900px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          {HERO_SLIDES.map((s, i) => (
            <div key={s.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
              <img src={s.img} alt={s.titleBold} className={`w-full h-full object-cover transition-transform duration-[6000ms] ${i === slide ? 'scale-100' : 'scale-105'}`} />
            </div>
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0804]/85 via-[#0f0804]/65 to-[#0f0804]/20" />
        </div>

        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="max-w-[620px]">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gold/20 border border-gold/40 rounded-full text-[0.8rem] tracking-[2px] text-gold-light mb-6 backdrop-blur-md animate-fade-up">
              {current.badge}
            </div>
            <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] text-white leading-[1.1] mb-5 font-bold animate-fade-up" style={{ animationDelay: '0.1s' }}>
              {current.title}{' '}
              <span className="bg-gradient-to-br from-gold-light to-gold bg-clip-text text-transparent">{current.titleBold}</span>
            </h1>
            <p className="text-[1.1rem] text-white/75 leading-[1.7] mb-9 max-w-[520px] animate-fade-up" style={{ animationDelay: '0.2s' }}>
              {current.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 mb-12 animate-fade-up" style={{ animationDelay: '0.3s' }}>
              <Link to={current.cta} className="btn btn-primary text-base px-7 py-3.5">
                {current.ctaLabel} <ArrowRight size={18} />
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 px-7 py-3.5 text-white/85 border border-white/25 rounded-md text-base transition-colors hover:border-gold hover:text-gold-light backdrop-blur-sm">
                <Heart size={16} /> Enquire Now
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 animate-fade-up" style={{ animationDelay: '0.4s' }}>
              <div><strong className="block font-display text-[1.6rem] text-gold-light leading-none">500+</strong><span className="text-[0.75rem] text-white/55 tracking-[1px] uppercase">Products</span></div>
              <div className="hidden sm:block w-px h-9 bg-white/20" />
              <div><strong className="block font-display text-[1.6rem] text-gold-light leading-none">1200+</strong><span className="text-[0.75rem] text-white/55 tracking-[1px] uppercase">Happy Customers</span></div>
              <div className="hidden sm:block w-px h-9 bg-white/20" />
              <div><strong className="block font-display text-[1.6rem] text-gold-light leading-none">10+</strong><span className="text-[0.75rem] text-white/55 tracking-[1px] uppercase">Years of Craft</span></div>
            </div>
          </div>
        </div>

        {/* Slide Dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${i === slide ? 'w-6 bg-gold' : 'w-2 bg-white/40'}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ── Features Strip ────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-border py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 p-4 rounded-lg transition-colors hover:bg-warm-white">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/20 flex items-center justify-center text-gold-dark shrink-0">
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-sans text-[0.9rem] font-semibold text-text-primary mb-1">{title}</h4>
                  <p className="text-[0.78rem] text-text-secondary leading-[1.4]">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-cream">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <div className="text-[0.75rem] font-bold uppercase tracking-[2px] text-gold-dark mb-4 flex justify-center items-center gap-1.5"><Sparkles size={14} />New Arrivals</div>
            <h2 className="font-display text-[2.4rem] font-bold text-text-primary mb-4">Fresh From Our Workshop</h2>
            <p className="text-[1rem] text-text-secondary leading-[1.6]">Discover our latest handcrafted additions — updated daily with love.</p>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="w-12 h-px bg-border" /><span className="w-2 h-2 rotate-45 bg-gold" /><span className="w-12 h-px bg-border" />
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton h-[380px] rounded-2xl" />
              ))}
            </div>
          ) : newProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-text-muted flex flex-col items-center gap-4">
              <ShoppingBag size={48} className="opacity-30" />
              <p>New arrivals coming soon — check back daily!</p>
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/products?latest=true" className="btn btn-outline">
              View All New Arrivals <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Category Banners ──────────────────────────────────────────────── */}
      <section className="py-24 bg-warm-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-[600px] mx-auto mb-16">
            <div className="text-[0.75rem] font-bold uppercase tracking-[2px] text-gold-dark mb-4">Collections</div>
            <h2 className="font-display text-[2.4rem] font-bold text-text-primary mb-4">Explore Our Range</h2>
            <div className="flex items-center justify-center gap-3 mt-6">
              <span className="w-12 h-px bg-border" /><span className="w-2 h-2 rotate-45 bg-gold" /><span className="w-12 h-px bg-border" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:h-[520px]">
            <Link to="/products?category=jute" className="relative rounded-2xl overflow-hidden group block h-[280px] lg:h-full">
              <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${slide1})` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0602]/80 to-[#0a0602]/10" />
              <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                <span className="inline-block px-3.5 py-1 bg-gold/90 text-white rounded-full text-[0.7rem] tracking-[2px] uppercase mb-2.5">Jute Bags</span>
                <h3 className="text-2xl text-white mb-2 font-bold">Natural &amp; Earthy</h3>
                <p className="text-[0.9rem] text-white/70 mb-3 hidden lg:block">Durable handwoven bags for everyday elegance</p>
                <span className="inline-flex items-center gap-1.5 text-[0.85rem] text-gold-light font-medium group-hover:gap-2.5 transition-all">Shop Now <ArrowRight size={16} /></span>
              </div>
            </Link>

            <div className="flex flex-col gap-6">
              <Link to="/products?category=tote" className="relative rounded-2xl overflow-hidden group block h-[280px] lg:flex-1">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${slide2})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0602]/80 to-[#0a0602]/10" />
                <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                  <span className="inline-block px-3.5 py-1 bg-gold/90 text-white rounded-full text-[0.7rem] tracking-[2px] uppercase mb-2.5">Tote Bags</span>
                  <h3 className="text-2xl text-white mb-2 font-bold">Modern &amp; Versatile</h3>
                  <span className="inline-flex items-center gap-1.5 text-[0.85rem] text-gold-light font-medium group-hover:gap-2.5 transition-all">Explore <ArrowRight size={14} /></span>
                </div>
              </Link>

              <Link to="/wedding" className="relative rounded-2xl overflow-hidden group block h-[280px] lg:flex-1">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url(${slide3})` }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0602]/80 to-[#0a0602]/10" />
                <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                  <span className="inline-block px-3.5 py-1 bg-[#d4a0c7]/90 text-white rounded-full text-[0.7rem] tracking-[2px] uppercase mb-2.5">Wedding</span>
                  <h3 className="text-2xl text-white mb-2 font-bold">Elegant &amp; Bridal</h3>
                  <span className="inline-flex items-center gap-1.5 text-[0.85rem] text-gold-light font-medium group-hover:gap-2.5 transition-all">Discover <ArrowRight size={14} /></span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      {featuredProducts.length > 0 && (
        <section className="py-24 bg-gradient-to-b from-warm-white to-cream">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-[600px] mx-auto mb-16">
              <div className="text-[0.75rem] font-bold uppercase tracking-[2px] text-gold-dark mb-4 flex justify-center items-center gap-1.5"><Star size={14} />Featured</div>
              <h2 className="font-display text-[2.4rem] font-bold text-text-primary mb-4">Our Finest Picks</h2>
              <p className="text-[1rem] text-text-secondary leading-[1.6]">Curated selections that embody the best of our craftsmanship.</p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <span className="w-12 h-px bg-border" /><span className="w-2 h-2 rotate-45 bg-gold" /><span className="w-12 h-px bg-border" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p, i) => (
                <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.08}s` }} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link to="/products" className="btn btn-primary">
                View Full Collection <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Banner ────────────────────────────────────────────────────── */}
      <section className="relative py-24 text-center overflow-hidden bg-deep">
        <div className="absolute inset-0 bg-gradient-to-br from-deep via-[#2d1810] to-[#1a0f05]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(201,168,76,0.08)_0%,transparent_70%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="w-16 h-16 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-6 animate-pulse-gold">
            <Heart size={32} />
          </div>
          <h2 className="font-display text-[clamp(1.8rem,3.5vw,2.8rem)] text-white mb-4">Bringing Your Vision to Life</h2>
          <p className="text-base text-white/65 leading-[1.7] mb-9 max-w-2xl mx-auto">
            Looking for custom jute bags for your wedding, event, or corporate gifting?<br />
            We create bespoke designs tailored to your needs.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact" className="btn btn-primary">
              Start Your Custom Order <ArrowRight size={16} />
            </Link>
            <Link to="/products" className="inline-flex items-center px-7 py-3.5 border border-white/25 rounded-md text-white/80 text-base transition-colors hover:border-gold hover:text-gold-light">
              Browse All Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
