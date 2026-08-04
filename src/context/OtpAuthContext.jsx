import { createContext, useContext, useState, useCallback } from 'react'
import axios from 'axios'

const OtpAuthContext = createContext(null)

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000'

// ─── OTP Bypass flag for local development testing ──────────────────────────
export const BYPASS_OTP = true; // Set to true to disable OTP SMS requirement

export function OtpAuthProvider({ children }) {
  const [mobile, setMobile] = useState(() => {
    const stored = sessionStorage.getItem('otp_mobile')
    if (stored) return stored
    return BYPASS_OTP ? '9999999999' : ''
  })
  const [token, setToken] = useState(() => {
    const stored = sessionStorage.getItem('otp_token')
    if (stored) return stored
    return BYPASS_OTP ? 'mock-dev-token' : ''
  })
  const isVerified = BYPASS_OTP ? true : !!token

  const sendOtp = useCallback(async (mobileNumber) => {
    const res = await axios.post(`${API_BASE}/api/send-otp`, { mobile: mobileNumber })
    return res.data
  }, [])

  const verifyOtp = useCallback(async (mobileNumber, otp) => {
    const res = await axios.post(`${API_BASE}/api/verify-otp`, { mobile: mobileNumber, otp })
    const { token: newToken, mobile: verifiedMobile } = res.data
    sessionStorage.setItem('otp_token', newToken)
    sessionStorage.setItem('otp_mobile', verifiedMobile)
    setToken(newToken)
    setMobile(verifiedMobile)
    return res.data
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('otp_token')
    sessionStorage.removeItem('otp_mobile')
    setToken('')
    setMobile('')
  }, [])

  return (
    <OtpAuthContext.Provider value={{ mobile, token, isVerified, sendOtp, verifyOtp, logout }}>
      {children}
    </OtpAuthContext.Provider>
  )
}

export const useOtpAuth = () => {
  const ctx = useContext(OtpAuthContext)
  if (!ctx) throw new Error('useOtpAuth must be used inside OtpAuthProvider')
  return ctx
}
