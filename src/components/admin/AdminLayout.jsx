import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, MessageSquare, LogOut, ShoppingBag, ExternalLink } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ADMIN_NAV = [
  { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { path: '/admin/products', label: 'Products', icon: Package },
  { path: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
]

export default function AdminLayout() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
    toast.success('Logged out successfully')
  }

  return (
    <div className="flex min-h-screen bg-[#f5f6fa] text-[#2c3e50] font-sans">
      <aside className="w-[260px] bg-white border-r border-[#e1e8ed] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#e1e8ed] flex items-center gap-3">
          <div className="w-9 h-9 bg-[#2c3e50] rounded-lg flex items-center justify-center text-white shrink-0 shadow-sm">
            <ShoppingBag size={18} />
          </div>
          <div className="flex flex-col leading-none">
            <div className="font-display text-[1.1rem] font-bold text-[#2c3e50] mb-1">Annalakshmi</div>
            <div className="text-[0.7rem] uppercase tracking-[1px] text-[#7f8c8d] font-semibold">Admin Panel</div>
          </div>
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

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <div className="flex-1 overflow-y-auto p-8 relative">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
