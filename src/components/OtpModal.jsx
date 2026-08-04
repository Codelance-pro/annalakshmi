import { useState, useEffect, useRef } from 'react'
import { X, Phone, Shield, RefreshCw, Loader2, CheckCircle2, AlertCircle } from 'lucide-react'
import { useOtpAuth } from '../context/OtpAuthContext'

const OTP_EXPIRY_SECONDS = 300 // 5 minutes

export default function OtpModal({ isOpen, onClose, onVerified }) {
  const { sendOtp, verifyOtp } = useOtpAuth()
  const [step, setStep] = useState('mobile') // 'mobile' | 'otp' | 'success'
  const [mobile, setMobile] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(OTP_EXPIRY_SECONDS)
  const [canResend, setCanResend] = useState(false)
  const otpRefs = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) {
      setStep('mobile')
      setMobile('')
      setOtp(['', '', '', '', '', ''])
      setError('')
      setLoading(false)
      clearInterval(timerRef.current)
    }
  }, [isOpen])

  const startTimer = () => {
    setTimeLeft(OTP_EXPIRY_SECONDS)
    setCanResend(false)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(timerRef.current)
          setCanResend(true)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleSendOtp = async (e) => {
    e.preventDefault()
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError('Please enter a valid 10-digit Indian mobile number.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await sendOtp(mobile)
      setStep('otp')
      startTimer()
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      otpRefs.current[5]?.focus()
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) {
      setError('Please enter the complete 6-digit OTP.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await verifyOtp(mobile, code)
      setStep('success')
      clearInterval(timerRef.current)
      setTimeout(() => {
        onVerified?.()
        onClose?.()
      }, 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setLoading(true)
    setError('')
    setOtp(['', '', '', '', '', ''])
    try {
      await sendOtp(mobile)
      startTimer()
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend OTP.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="otp-overlay" onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="otp-modal">
        {/* Close */}
        <button className="otp-close" onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        {/* Header */}
        <div className="otp-header">
          <div className="otp-icon-wrap">
            {step === 'success'
              ? <CheckCircle2 size={32} className="text-green-500" />
              : step === 'otp'
              ? <Shield size={32} />
              : <Phone size={32} />
            }
          </div>
          <h2 className="otp-title">
            {step === 'success' ? 'Verified!' : step === 'otp' ? 'Enter OTP' : 'Verify Your Number'}
          </h2>
          <p className="otp-subtitle">
            {step === 'success'
              ? 'Your number has been verified. Opening the designer...'
              : step === 'otp'
              ? `We sent a 6-digit OTP to +91 ${mobile}`
              : 'Enter your mobile number to access the tote bag designer'}
          </p>
        </div>

        {/* Step: Mobile */}
        {step === 'mobile' && (
          <form onSubmit={handleSendOtp} className="otp-form">
            <div className="otp-input-group">
              <label htmlFor="otp-mobile">Mobile Number</label>
              <div className="otp-phone-row">
                <span className="otp-country-code">+91</span>
                <input
                  id="otp-mobile"
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={mobile}
                  onChange={e => { setMobile(e.target.value.replace(/\D/g, '')); setError('') }}
                  className="otp-text-input"
                  autoFocus
                  autoComplete="tel"
                />
              </div>
            </div>
            {error && (
              <div className="otp-error">
                <AlertCircle size={15} /> {error}
              </div>
            )}
            <button type="submit" className="otp-btn-primary" disabled={loading}>
              {loading ? <Loader2 size={18} className="animate-spin-slow" /> : <Phone size={18} />}
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}

        {/* Step: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="otp-form">
            <div className="otp-boxes-row" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={el => otpRefs.current[i] = el}
                  type="tel"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => handleOtpKeyDown(i, e)}
                  className={`otp-box ${digit ? 'otp-box--filled' : ''}`}
                  autoComplete="one-time-code"
                />
              ))}
            </div>

            <div className="otp-timer-row">
              {canResend ? (
                <button type="button" className="otp-resend-btn" onClick={handleResend} disabled={loading}>
                  <RefreshCw size={14} /> Resend OTP
                </button>
              ) : (
                <span className="otp-countdown">
                  Resend in <strong>{formatTime(timeLeft)}</strong>
                </span>
              )}
            </div>

            {error && (
              <div className="otp-error">
                <AlertCircle size={15} /> {error}
              </div>
            )}

            <button type="submit" className="otp-btn-primary" disabled={loading || otp.join('').length !== 6}>
              {loading ? <Loader2 size={18} className="animate-spin-slow" /> : <Shield size={18} />}
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            <button
              type="button"
              className="otp-back-btn"
              onClick={() => { setStep('mobile'); setError(''); clearInterval(timerRef.current); setOtp(['', '', '', '', '', '']) }}
            >
              ← Change Number
            </button>
          </form>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="otp-success">
            <div className="otp-success-ring" />
            <p>Opening your tote bag designer...</p>
          </div>
        )}
      </div>
    </div>
  )
}
