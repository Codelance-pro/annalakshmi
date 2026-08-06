import { useState, useEffect } from 'react'
import { Package, ShoppingBag, Heart, Star, Sparkles, MessageSquare, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { statsAPI, productAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUrl'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [recentProducts, setRecentProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([statsAPI.get(), productAPI.getAll({ includeCustomizable: true })])
      .then(([sRes, pRes]) => {
        setStats(sRes.data)
        const pList = Array.isArray(pRes.data) ? pRes.data : pRes.data?.products || []
        setRecentProducts(pList.slice(0, 5))
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const STAT_CARDS = stats ? [
    { label: 'Total Products', value: stats.total, icon: '📦', cls: 'bg-gold/10 text-gold-dark' },
    { label: 'Jute Bags', value: stats.jute, icon: '🌿', cls: 'bg-[#2ecc71]/10 text-[#27ae60]' },
    { label: 'Tote Bags', value: stats.tote, icon: '👜', cls: 'bg-[#3498db]/10 text-[#2980b9]' },
    { label: 'Wedding Bags', value: stats.wedding, icon: '💍', cls: 'bg-[#e74c3c]/10 text-[#c0392b]' },
    { label: 'New Arrivals', value: stats.newArrivals, icon: '✨', cls: 'bg-gold/10 text-gold-dark' },
    { label: 'Featured', value: stats.featured, icon: '⭐', cls: 'bg-[#2ecc71]/10 text-[#27ae60]' },
    { label: 'Inquiries', value: stats.inquiries, icon: '📩', cls: 'bg-[#3498db]/10 text-[#2980b9]' },
  ] : []

  return (
    <div>
      <h1 className="font-display text-[2rem] font-bold text-text-primary mb-1 tracking-tight">Dashboard</h1>
      <p className="text-[0.95rem] text-text-secondary mb-8">Welcome back! Here's an overview of your store.</p>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-[100px] rounded-2xl" />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
            {STAT_CARDS.slice(0, 4).map(card => (
              <div key={card.label} className="bg-white rounded-2xl p-5 border border-[#e1e8ed] shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-transform hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[1.2rem] shrink-0 ${card.cls}`}>{card.icon}</div>
                <div>
                  <div className="font-display text-[1.4rem] font-bold text-text-primary leading-[1.1] mb-1">{card.value}</div>
                  <div className="text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-text-muted">{card.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
            {STAT_CARDS.slice(4).map(card => (
              <div key={card.label} className="bg-white rounded-2xl p-5 border border-[#e1e8ed] shadow-[0_4px_12px_rgba(0,0,0,0.02)] flex items-center gap-4 transition-transform hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[1.2rem] shrink-0 ${card.cls}`}>{card.icon}</div>
                <div>
                  <div className="font-display text-[1.4rem] font-bold text-text-primary leading-[1.1] mb-1">{card.value}</div>
                  <div className="text-[0.75rem] font-semibold uppercase tracking-[0.5px] text-text-muted">{card.label}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Quick actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <Link to="/admin/products" className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-[#e1e8ed] rounded-xl text-[0.95rem] font-semibold text-text-primary transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:shadow-md hover:border-gold-light group">
          <Package size={20} className="text-text-muted transition-colors group-hover:text-gold" />
          <span>Manage Products</span>
        </Link>
        <Link to="/admin/inquiries" className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-[#e1e8ed] rounded-xl text-[0.95rem] font-semibold text-text-primary transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:shadow-md hover:border-gold-light group">
          <MessageSquare size={20} className="text-text-muted transition-colors group-hover:text-gold" />
          <span>View Inquiries</span>
        </Link>
        <a href="/" target="_blank" className="flex items-center gap-2.5 px-6 py-3.5 bg-white border border-[#e1e8ed] rounded-xl text-[0.95rem] font-semibold text-text-primary transition-all shadow-[0_4px_12px_rgba(0,0,0,0.02)] hover:-translate-y-0.5 hover:shadow-md hover:border-gold-light group">
          <TrendingUp size={20} className="text-text-muted transition-colors group-hover:text-gold" />
          <span>View Live Site</span>
        </a>
      </div>

      {/* Recent Products */}
      <div className="bg-white rounded-2xl border border-[#e1e8ed] shadow-[0_4px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e1e8ed] flex items-center justify-between bg-[#fafbfc]">
          <div className="font-sans text-[1.05rem] font-bold text-text-primary">Recent Products</div>
          <Link to="/admin/products" className="btn btn-ghost text-[0.82rem] px-3.5 py-1.5">
            View All
          </Link>
        </div>
        <div className="flex flex-col">
          {recentProducts.length === 0 ? (
            <div className="p-8 text-center text-text-muted">
              No products yet. <Link to="/admin/products" className="text-gold-dark hover:underline">Add your first product →</Link>
            </div>
          ) : (
            recentProducts.map(p => {
              const pid = p.id || p._id
              const img = p.images?.[0] ? getImageUrl(p.images[0]) : null
              return (
                <div key={pid} className="flex items-center gap-4 px-6 py-4 border-b border-[#e1e8ed] last:border-b-0 transition-colors hover:bg-[#fafbfc]">
                  <div className="w-12 h-12 rounded-lg bg-[#f8f9fa] border border-[#e1e8ed] overflow-hidden shrink-0 flex items-center justify-center text-[1.2rem]">
                    {img
                      ? <img src={img} alt={p.name} className="w-full h-full object-cover" />
                      : <div className="text-text-muted/50">📦</div>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-[0.95rem] text-text-primary truncate mb-1">{p.name}</div>
                    <div className="text-[0.8rem] text-text-muted capitalize">
                      {p.category} • {new Date(p.createdAt).toLocaleDateString('en-IN')}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {p.isNew && <span className="px-2 py-0.5 bg-[#3498db]/10 text-[#2980b9] rounded border border-[#3498db]/20 text-[0.65rem] font-bold uppercase tracking-[1px]">New</span>}
                    {p.featured && <span className="px-2 py-0.5 bg-[#f1c40f]/10 text-[#f39c12] rounded border border-[#f1c40f]/20 text-[0.65rem] font-bold uppercase tracking-[1px]">Featured</span>}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
