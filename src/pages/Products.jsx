import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X, PackageOpen } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../services/api'

const CATEGORIES = [
  { id: 'all', label: 'All Products' },
  { id: 'jute', label: 'Jute Bags' },
  { id: 'tote', label: 'Tote Bags' },
  { id: 'wedding', label: 'Wedding Bags' },
]

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const activeCategory = searchParams.get('category') || 'all'
  const showLatest = searchParams.get('latest') === 'true'

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const params = {}
        if (activeCategory !== 'all') params.category = activeCategory
        if (showLatest) params.latest = true
        const res = await productAPI.getAll(params)
        setProducts(res.data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [activeCategory, showLatest])

  const setCategory = (cat) => {
    const p = new URLSearchParams(searchParams)
    if (cat === 'all') p.delete('category')
    else p.set('category', cat)
    p.delete('latest')
    setSearchParams(p)
  }

  const filtered = products.filter(p =>
    search === '' ||
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase()) ||
    p.tags?.some(t => t.toLowerCase().includes(search.toLowerCase()))
  )

  const pageTitle = showLatest
    ? 'New Arrivals'
    : activeCategory !== 'all'
    ? CATEGORIES.find(c => c.id === activeCategory)?.label
    : 'All Products'

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-deep text-white pt-[120px] pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1208] via-[#0f0a04] to-[#1a1208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(201,168,76,0.05)_0%,transparent_70%)]" />
        <div className="container mx-auto relative z-10 animate-fade-up">
          <h1 className="font-display text-[clamp(2.2rem,4vw,3.2rem)] font-bold mb-4">{pageTitle}</h1>
          <p className="text-[1.05rem] text-white/70 max-w-[600px] mx-auto">Explore our handcrafted collection — each bag tells a story of artisan craftsmanship</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        {/* Controls */}
        <div className="flex flex-wrap items-center gap-4 mb-9 pb-6 border-b border-border">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-[360px]">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              placeholder="Search bags, styles, tags..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-border rounded-full py-2.5 pl-10 pr-10 text-[0.9rem] text-text-primary transition-all duration-300 focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-text-muted/10 text-text-secondary flex items-center justify-center transition-colors hover:bg-text-muted/20 hover:text-text-primary">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                className={`px-4 py-2 rounded-full text-[0.85rem] font-medium transition-all duration-200 border ${activeCategory === cat.id && !showLatest ? 'bg-gold text-white border-gold shadow-md shadow-gold/20' : 'bg-white text-text-secondary border-border hover:border-gold/40 hover:text-gold-dark'}`}
                onClick={() => setCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
            <button
              className={`px-4 py-2 rounded-full text-[0.85rem] font-medium transition-all duration-200 border ${showLatest ? 'bg-gradient-to-r from-gold to-gold-dark text-white border-transparent shadow-md shadow-gold/20' : 'bg-white text-text-secondary border-border hover:border-gold/40 hover:text-gold-dark'}`}
              onClick={() => { const p = new URLSearchParams(); p.set('latest', 'true'); setSearchParams(p) }}
            >
              ✦ New Arrivals
            </button>
          </div>

          {/* Result count */}
          <div className="text-[0.85rem] font-medium text-text-muted shrink-0 w-full sm:w-auto text-right">
            {loading ? '...' : `${filtered.length} products`}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton h-[380px] rounded-2xl" />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} style={{ animationDelay: `${i * 0.06}s` }} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-border flex flex-col items-center justify-center animate-fade-up">
            <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-gold-dark mb-5">
              <PackageOpen size={40} />
            </div>
            <h3 className="font-display text-[1.5rem] text-text-primary mb-2 font-bold">No products found</h3>
            <p className="text-[0.95rem] text-text-secondary max-w-[400px]">
              {search
                ? `No results for "${search}". Try a different search term.`
                : 'This collection will be updated soon. Stay tuned!'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
