import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Wedding from './pages/Wedding'
import ProductDetail from './pages/ProductDetail'
import Contact from './pages/Contact'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminInquiries from './pages/admin/AdminInquiries'
import AdminLayout from './components/admin/AdminLayout'
import ProtectedRoute from './components/admin/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'
import { OtpAuthProvider } from './context/OtpAuthContext'
import ScrollToTop from './components/ScrollToTop'
import ToteBagDesigner from './pages/ToteBagDesigner'

function App() {
  return (
    <AuthProvider>
      <OtpAuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#e8d5b7',
              border: '1px solid rgba(212,175,55,0.3)',
              borderRadius: '12px',
            },
          }}
        />
        <ScrollToTop />
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inquiries" element={<AdminInquiries />} />
          </Route>

          {/* Tote Bag Designer (full-screen, no navbar/footer) */}
          <Route path="/customize/:id" element={<ToteBagDesigner />} />
          <Route path="/customize" element={<ToteBagDesigner />} />

          {/* Public Routes */}
          <Route path="/*" element={
            <>
              <Navbar />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/wedding" element={<Wedding />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
              </main>
              <Footer />
            </>
          } />
        </Routes>
      </OtpAuthProvider>
    </AuthProvider>
  )
}

export default App
