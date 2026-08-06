import { Link } from 'react-router-dom'
import { Eye, MessageCircle } from 'lucide-react'
import { getImageUrl } from '../utils/imageUrl'

const CATEGORY_LABEL = { jute: 'Jute Bag', tote: 'Tote Bag', wedding: 'Wedding Bag' }

export default function ProductCard({ product, style }) {
  const img = getImageUrl(product.images?.[0])
  const productId = product.id || product._id

  return (
    <div className="bg-white rounded-2xl border border-black/5 overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_12px_40px_rgba(107,68,35,0.08)] opacity-0 animate-fade-up relative" style={style}>
      {product.isNew && (
        <div className="absolute top-4 left-0 z-10 bg-gradient-to-r from-gold to-gold-dark text-white text-[0.65rem] font-bold uppercase tracking-[1.5px] py-1 px-3 rounded-r-md shadow-md">
          New Arrival
        </div>
      )}
      
      <Link to={`/product/${productId}`} className="block">
        <div className="aspect-[4/3] bg-warm-white relative overflow-hidden group">
          <img src={img} alt={product.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          
          <div className="absolute inset-0 bg-[#6b4423]/40 backdrop-blur-sm opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center z-10">
            <span className="bg-white text-brown px-5 py-2.5 rounded-full font-medium text-[0.85rem] flex items-center gap-2 transform translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 shadow-md">
              <Eye size={16} /> View Details
            </span>
          </div>

          {product.featured && (
            <span className="absolute top-4 right-4 z-20 bg-white/90 backdrop-blur-md text-gold-dark text-[0.7rem] font-bold uppercase tracking-wider py-1 px-2.5 rounded-md shadow-sm">
              Featured
            </span>
          )}
          
          {product.category === 'wedding' && !product.featured && (
            <span className="absolute top-4 right-4 z-20 bg-[#f5ebeb]/90 backdrop-blur-md text-[#b47fa3] text-[0.7rem] font-bold uppercase tracking-wider py-1 px-2.5 rounded-md shadow-sm">
              Wedding
            </span>
          )}
        </div>
      </Link>
      
      <div className="flex-1 p-5 flex flex-col">
        <div className="text-[0.7rem] font-bold uppercase tracking-[1.5px] text-gold mb-2">
          {CATEGORY_LABEL[product.category] || product.category}
        </div>
        
        <Link to={`/product/${productId}`}>
          <h3 className="font-display text-[1.1rem] font-bold text-text-primary leading-[1.3] mb-2 transition-colors hover:text-gold-dark line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        {product.description && (
          <p className="text-[0.85rem] text-text-secondary leading-[1.6] line-clamp-2 mb-4">
            {product.description}
          </p>
        )}
        
        <div className="mt-auto pt-2">
          {product.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {product.tags.slice(0, 3).map(t => (
                <span key={t} className="inline-block px-2.5 py-1 bg-cream rounded-md text-[0.72rem] font-medium text-text-secondary capitalize border border-border/50">
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-3 p-4 border-t border-black/5 bg-[#fafafa]">
        <Link to={`/product/${productId}`} className="btn btn-ghost flex-1 justify-center text-[0.82rem] py-2 px-3.5">
          <Eye size={14} /> Details
        </Link>
        <Link to={`/contact?product=${productId}`} className="btn btn-primary flex-1 justify-center text-[0.82rem] py-2 px-3.5">
          <MessageCircle size={14} /> Enquire
        </Link>
      </div>
    </div>
  )
}
