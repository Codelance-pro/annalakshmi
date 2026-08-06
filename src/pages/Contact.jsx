import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { inquiryAPI } from '../services/api'

export default function Contact() {
  const [searchParams] = useSearchParams()
  const productName = searchParams.get('name') || ''
  const productId = searchParams.get('product') || ''

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: productName ? `Hi, I'm interested in "${productName}". Please share more details.` : '',
  })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await inquiryAPI.submit({ ...form, productId })
      setSent(true)
      toast.success('Your enquiry has been sent! We\'ll get back to you shortly.')
    } catch (err) {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-deep text-white pt-[120px] pb-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1208] via-[#0f0a04] to-[#1a1208]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(201,168,76,0.05)_0%,transparent_70%)]" />
        <div className="container mx-auto relative z-10 animate-fade-up">
          <h1 className="font-display text-[clamp(2.2rem,4vw,3.2rem)] font-bold mb-4">
            Get in <span className="bg-gradient-to-r from-gold-light to-gold bg-clip-text text-transparent">Touch</span>
          </h1>
          <p className="text-[1.05rem] text-white/70 max-w-[600px] mx-auto">We'd love to hear from you — enquire about products, custom orders, or bulk requirements.</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 max-w-[1200px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Info */}
          <div className="flex flex-col animate-fade-up">
            <h2 className="font-display text-[2rem] lg:text-[2.5rem] font-bold text-text-primary mb-6">Let's Create Something Beautiful</h2>
            <p className="text-[1.1rem] text-text-secondary leading-[1.7] mb-10">
              Whether you're planning a wedding, a corporate event, or simply love beautiful jute bags —
              we're here to help you find or create the perfect piece.
            </p>

            <div className="flex flex-col gap-5 mb-10">
              {[
                { icon: Phone, label: 'Phone / WhatsApp', value: '+91 63742 86960' },
                { icon: Mail, label: 'Email', value: 'suriyanarayanan1331@gmail.com' },
                { icon: MapPin, label: 'Location', value: 'Elukadal street, Madurai, Tamil Nadu, India' },
                { icon: Clock, label: 'Working Hours', value: 'Mon–Sun, 6:00 AM – 11:00 PM IST' },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-5 p-5 bg-white border border-border rounded-xl transition-all duration-300 hover:shadow-warm hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold-dark shrink-0">
                    <Icon size={20} />
                  </div>
                  <div>
                    <div className="text-[0.8rem] font-bold uppercase tracking-[1px] text-text-muted mb-1.5">{label}</div>
                    <div className="text-[1.05rem] font-semibold text-text-primary">{value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#fafafa] border-l-4 border-gold p-6 rounded-r-xl text-[0.95rem] text-text-secondary leading-[1.6]">
              <strong className="text-text-primary">Note:</strong> We do not process online payments. All orders are coordinated directly via
              WhatsApp, email, or phone after your enquiry.
            </div>
          </div>

          {/* Form */}
          <div className="relative animate-fade-up" style={{ animationDelay: '0.1s' }}>
            {sent ? (
              <div className="bg-white rounded-2xl p-10 lg:p-14 text-center border border-border shadow-warm h-full flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-[#27ae60]/10 text-[#27ae60] flex items-center justify-center mb-6 mx-auto animate-fade-up">
                  <CheckCircle size={40} />
                </div>
                <h3 className="font-display text-[1.8rem] font-bold text-text-primary mb-4 animate-fade-up" style={{ animationDelay: '0.1s' }}>Enquiry Sent Successfully!</h3>
                <p className="text-[1.05rem] text-text-secondary leading-[1.6] mb-8 animate-fade-up" style={{ animationDelay: '0.2s' }}>Thank you for reaching out. We'll contact you within 24 hours with all the details you need.</p>
                <button
                  className="btn btn-outline animate-fade-up" style={{ animationDelay: '0.3s' }}
                  onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', message: '' }) }}
                >
                  Send Another Enquiry
                </button>
              </div>
            ) : (
              <form className="bg-white rounded-2xl p-8 lg:p-10 border border-border shadow-warm" onSubmit={submit}>
                <h3 className="font-display text-[1.6rem] font-bold text-text-primary mb-8 border-b border-border pb-5">Send Us an Enquiry</h3>
                {productName && (
                  <div className="bg-gold/10 border border-gold/30 text-gold-dark px-5 py-3.5 rounded-lg mb-8 text-[0.95rem]">
                    Enquiring about: <strong className="font-semibold text-text-primary">{productName}</strong>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-0">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your name"
                      value={form.name}
                      onChange={handle}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={handle}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone / WhatsApp</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={handle}
                  />
                </div>

                <div className="form-group">
                  <label>Your Message *</label>
                  <textarea
                    name="message"
                    className="form-control"
                    placeholder="Tell us what you're looking for — product interest, quantity, customisation needs..."
                    value={form.message}
                    onChange={handle}
                    required
                    rows={6}
                  />
                </div>

                <button type="submit" className="btn btn-primary w-full justify-center mt-4 py-3.5 text-[1rem]" disabled={loading}>
                  {loading ? (
                    <><span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={18} /> Send Enquiry</>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
