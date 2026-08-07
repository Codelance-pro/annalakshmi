import { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, MessageSquare, LogOut, ShoppingBag, ExternalLink, Palette, Menu, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ADMIN_NAV = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { path: '/admin/designs', label: 'Saved Designs', icon: Palette },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    toast.success('Logged out successfully')
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6fa] text-[#2c3e50] font-sans">
      {/* Mobile top bar */}
      <div className="fixed top-0 left-0 right-0 z-[1000] bg-white border-b border-[#e1e8ed] flex items-center justify-between px-4 py-3 md:hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#2c3e50] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShoppingBag size={16} />
          </div>
          <div className="flex flex-col leading-none">
            <div className="font-display text-[1rem] font-bold text-[#2c3e50]">Annalakshmi</div>
            <div className="text-[0.6rem] uppercase tracking-[1px] text-[#7f8c8d] font-semibold">Admin</div>
          </div>
        </div>
        <button
          className="w-10 h-10 rounded-lg flex items-center justify-center text-[#2c3e50] transition-colors hover:bg-[#f0f0f0]"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Backdrop overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-[1010] bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-[1020] h-full w-[260px] bg-white border-r border-[#e1e8ed] flex flex-col shrink-0
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:z-auto
        `}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-[#e1e8ed] flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2c3e50] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShoppingBag size={18} />
          </div>
          <div className="flex flex-col leading-none">
            <div className="font-display text-[1.1rem] font-bold text-[#2c3e50] mb-1">Annalakshmi</div>
            <div className="text-[0.7rem] uppercase tracking-[1px] text-[#7f8c8d] font-semibold">Admin Panel</div>
          </div>
          {/* Close button (mobile only, inside sidebar) */}
          <button
            className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center text-[#7f8c8d] transition-colors hover:bg-[#f0f0f0] hover:text-[#2c3e50] md:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-1.5 overflow-y-auto">
          {ADMIN_NAV.map(({ path, label, icon: Icon, end }) => (
            <NavLink
              key={path}
              to={path}
              end={end}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-[0.95rem] font-medium transition-all duration-200 ${isActive ? 'bg-[#3498db]/10 text-[#2980b9] shadow-sm' : 'text-[#7f8c8d] hover:bg-[#f8f9fa] hover:text-[#34495e]'}`}
            >
              {({ isActive }) => (
                <>
                  <Icon size={18} className={isActive ? 'text-[#3498db]' : ''} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-[#e1e8ed] bg-[#fafbfc]">
          <a href="/" target="_blank" className="flex items-center justify-center gap-2 w-full px-4 py-2 mb-3 text-[0.8rem] font-semibold text-[#7f8c8d] bg-white border border-[#e1e8ed] rounded-md transition-colors hover:bg-[#f8f9fa] hover:text-[#2c3e50]">
            <ExternalLink size={14} /> View Site
          </a>
          <button className="flex items-center justify-center gap-2 w-full px-4 py-2.5 text-[0.85rem] font-medium text-[#e74c3c] bg-[#e74c3c]/10 rounded-md transition-colors hover:bg-[#e74c3c] hover:text-white" onClick={handleLogout}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Add top padding on mobile for the fixed top bar */}
        <div className="flex-1 overflow-y-auto p-4 pt-[72px] sm:p-6 sm:pt-[72px] md:p-8 md:pt-8 relative">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
