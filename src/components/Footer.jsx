import { Link } from 'react-router-dom'
import { ShoppingBag, Phone, Mail, MapPin, Heart, Share2, Globe, Rss } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-deep text-[#d4c5b9] pt-20 pb-6 relative overflow-hidden mt-auto">
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-3 text-white w-fit group">
              <div className="w-10 h-10 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center text-white shrink-0 group-hover:-translate-y-0.5 transition-transform">
                <ShoppingBag size={20} />
              </div>
              <div className="flex flex-col leading-none">
                <div className="font-display text-[1.3rem] font-bold tracking-wide">Annalakshmi</div>
                <div className="text-[0.68rem] tracking-[3px] uppercase text-gold mt-1">Jute &amp; Craft</div>
              </div>
            </Link>
            <p className="text-[0.92rem] leading-relaxed text-[#a89b8d] pr-4">
              Handcrafted jute and tote bags blending tradition with contemporary elegance. Each piece tells a story of artisanal craftsmanship.
            </p>
            <div className="flex gap-3 mt-2">
              <a href="#" aria-label="Instagram" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-gold hover:bg-gold hover:text-white hover:-translate-y-1 transition-all"><Share2 size={16} /></a>
              <a href="#" aria-label="Facebook" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-gold hover:bg-gold hover:text-white hover:-translate-y-1 transition-all"><Globe size={16} /></a>
              <a href="#" aria-label="Youtube" className="flex items-center justify-center w-9 h-9 rounded-full bg-white/5 text-gold hover:bg-gold hover:text-white hover:-translate-y-1 transition-all"><Rss size={16} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-display text-[1.1rem] font-semibold tracking-wide border-l-2 border-gold pl-3">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Home', path: '/' },
                { label: 'Products', path: '/products' },
                { label: 'Wedding Bags', path: '/wedding' },
                { label: 'New Arrivals', path: '/products?latest=true' },
                { label: 'Contact Us', path: '/contact' },
              ].map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-[0.9rem] text-[#a89b8d] transition-colors hover:text-gold hover:pl-1 inline-block duration-200">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-display text-[1.1rem] font-semibold tracking-wide border-l-2 border-gold pl-3">Collections</h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Jute Bags', path: '/products?category=jute' },
                { label: 'Tote Bags', path: '/products?category=tote' },
                { label: 'Wedding Bags', path: '/wedding' },
                { label: 'Featured Pieces', path: '/products?featured=true' },
                { label: 'Daily Arrivals', path: '/products?latest=true' },
              ].map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="text-[0.9rem] text-[#a89b8d] transition-colors hover:text-gold hover:pl-1 inline-block duration-200">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <h4 className="text-white font-display text-[1.1rem] font-semibold tracking-wide border-l-2 border-gold pl-3">Get in Touch</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3 text-[0.9rem] text-[#a89b8d]">
                <Phone size={16} className="text-gold mt-0.5 shrink-0" />
                <span>+91 63742 86960</span>
              </li>
              <li className="flex items-start gap-3 text-[0.9rem] text-[#a89b8d]">
                <Mail size={16} className="text-gold mt-0.5 shrink-0" />
                <span>suriyanarayanan1331@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-[0.9rem] text-[#a89b8d]">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span>Elukadal street, Madurai, Tamil Nadu, India</span>
              </li>
            </ul>
            <Link to="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 mt-2 rounded-md border border-gold/30 text-gold text-[0.85rem] font-medium transition-colors hover:bg-gold hover:text-white w-fit">
              <Heart size={14} /> Make an Enquiry
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/5 text-[0.82rem] text-[#8c7f70]">
          <p>© {new Date().getFullYear()} Annalakshmi bags &amp; Craft. All rights reserved.</p>
          <p className="flex items-center gap-1.5">Made with <Heart size={12} className="text-gold animate-pulse-gold" /> in India</p>
        </div>
      </div>
    </footer>
  )
}
