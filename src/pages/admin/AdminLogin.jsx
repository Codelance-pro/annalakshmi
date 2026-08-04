import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (isAdmin) { navigate('/admin'); return null }

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // fake loading
    const ok = login(username, password)
    setLoading(false)
    if (ok) {
      toast.success('Welcome back, Admin!')
      navigate('/admin')
    } else {
      toast.error('Invalid credentials. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-deep relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(201,168,76,0.15)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="bg-white/95 backdrop-blur-xl w-full max-w-[420px] rounded-2xl p-10 shadow-[0_24px_60px_rgba(0,0,0,0.4)] relative z-10 border border-white/20 animate-fade-up">
        <div className="w-14 h-14 bg-gradient-to-br from-gold to-gold-dark rounded-xl flex items-center justify-center text-white mx-auto mb-6 shadow-md shadow-gold/30">
          <ShoppingBag size={24} />
        </div>
        
        <h1 className="font-display text-[1.8rem] font-bold text-center text-text-primary mb-1">Admin Panel</h1>
        <p className="text-[0.85rem] uppercase tracking-[2px] text-center text-text-muted font-bold mb-8">Annalakshmi Jute &amp; Craft</p>

        <form onSubmit={submit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.85rem] font-medium text-text-secondary tracking-wide">Username</label>
            <div className="relative">
              <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                className="w-full bg-[#f8f9fa] border border-[#e1e8ed] rounded-lg py-3 pl-10 pr-4 text-[0.95rem] text-text-primary transition-colors focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15"
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                autoFocus
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[0.85rem] font-medium text-text-secondary tracking-wide">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type={showPass ? 'text' : 'password'}
                className="w-full bg-[#f8f9fa] border border-[#e1e8ed] rounded-lg py-3 pl-10 pr-10 text-[0.95rem] text-text-primary transition-colors focus:outline-none focus:border-gold focus:ring-[3px] focus:ring-gold/15"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:text-text-primary transition-colors hover:bg-black/5"
                onClick={() => setShowPass(s => !s)}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="text-[0.8rem] text-center text-text-secondary mt-1">
            Default: <code className="bg-black/5 px-1.5 py-0.5 rounded text-text-primary">admin</code> / <code className="bg-black/5 px-1.5 py-0.5 rounded text-text-primary">annalakshmi2024</code>
          </div>

          <button 
            type="submit" 
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-white font-medium py-3.5 rounded-lg shadow-md shadow-gold/30 hover:-translate-y-0.5 transition-all mt-2 disabled:opacity-70 disabled:cursor-not-allowed" 
            disabled={loading}
          >
            {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Lock size={16} />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-8">
          <a href="/" className="text-[0.85rem] text-text-secondary font-medium transition-colors hover:text-gold">← Back to Website</a>
        </div>
      </div>
    </div>
  )
}
