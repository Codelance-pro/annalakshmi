import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, ChevronDown, Heart } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Products', path: '/products', children: [
    { label: 'Jute Bags', path: '/products?category=jute' },
    { label: 'Tote Bags', path: '/products?category=tote' },
    { label: 'All Collections', path: '/products' },
  ]},
  { label: 'Design Studio', path: '/customize' },
  { label: 'Wedding Bags', path: '/wedding' },
  { label: 'Contact', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setActiveDropdown(null)
  }, [location.pathname])

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path.split('?')[0])
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-300 ${scrolled ? 'py-3' : 'py-5'}`}>
      {/* Background layer */}
      <div className={`absolute inset-0 bg-[#faf6ef]/98 backdrop-blur-xl transition-all duration-300 -z-10 ${scrolled ? 'shadow-[0_4px_24px_rgba(107,68,35,0.15)]' : 'shadow-[0_4px_24px_rgba(107,68,35,0.08)]'}`} />

      <div className="container mx-auto px-4 flex items-center justify-between gap-8 relative">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-text-primary z-10 relative group">
          <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center text-white shadow-[0_4px_12px_rgba(201,168,76,0.35)] shrink-0 transition-transform group-hover:scale-105">
            <ShoppingBag size={20} />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-display text-[1.2rem] font-bold text-text-primary transition-colors group-hover:text-gold-dark">Annalakshmi</span>
            <span className="text-[0.68rem] tracking-[2px] uppercase text-gold mt-0.5">Jute &amp; Craft</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(link => (
            <div
              key={link.path}
              className="relative"
              onMouseEnter={() => link.children && setActiveDropdown(link.path)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                to={link.path}
                className={`flex items-center gap-1.5 px-4 py-2 text-[0.9rem] rounded-lg transition-all duration-200 whitespace-nowrap ${isActive(link.path) ? 'font-semibold text-gold-dark bg-gold/10' : 'font-medium text-text-primary hover:text-gold-dark hover:bg-gold/10'}`}
              >
                {link.label}
                {link.children && <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === link.path ? 'rotate-180' : ''}`} />}
              </Link>

              {link.children && (
                <div className={`absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 bg-white border border-border rounded-xl shadow-[0_12px_40px_rgba(107,68,35,0.15)] min-w-[180px] p-2 transition-all duration-200 origin-top ${activeDropdown === link.path ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}>
                  {link.children.map(child => (
                    <Link key={child.path} to={child.path} className="block px-4 py-2.5 text-[0.88rem] text-text-secondary rounded-lg transition-all duration-200 hover:bg-gold/10 hover:text-gold-dark hover:pl-5">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 z-10 relative">
          <Link to="/contact" className="hidden md:inline-flex btn btn-primary text-[0.85rem] px-5 py-2.5">
            <Heart size={15} /> Enquire Now
          </Link>
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-text-primary hover:bg-gold/10 transition-colors"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden absolute top-full left-0 w-full bg-[#faf6ef]/98 backdrop-blur-xl border-t border-border overflow-hidden transition-all duration-400 shadow-[0_10px_20px_rgba(0,0,0,0.1)] ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="py-2">
          {NAV_LINKS.map(link => (
            <div key={link.path}>
              <Link
                to={link.path}
                className={`block px-6 py-3.5 text-base font-medium border-b border-gold/10 transition-colors ${isActive(link.path) ? 'text-gold-dark bg-gold/5' : 'text-text-primary hover:text-gold-dark hover:bg-gold/5'}`}
              >
                {link.label}
              </Link>
              {link.children && (
                <div className="bg-gold/5">
                  {link.children.map(child => (
                    <Link key={child.path} to={child.path} className="block px-6 py-2.5 pl-10 text-[0.9rem] text-text-secondary border-b border-gold/10 transition-colors hover:text-gold-dark">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className="p-4 text-center">
            <Link to="/contact" className="btn btn-primary w-full justify-center">
              Enquire Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
