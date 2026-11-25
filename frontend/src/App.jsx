import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Listings from './pages/Listings'
import CarDetail from './pages/CarDetail'
import Login from './pages/Login'
import Register from './pages/Register'
import SellerDashboard from './pages/SellerDashboard'
import BuyerDashboard from './pages/BuyerDashboard'
import ListCar from './pages/ListCar'
import Checkout from './pages/Checkout'
import NotFound from './pages/NotFound'
import { AuthProvider } from './context/AuthContext'
import ScrollToTop from './components/ScrollToTop'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: { borderRadius: '12px', fontSize: '14px', fontWeight: 500 },
          }}
        />
        <Navbar />
        <main className="min-h-screen">
          <Routes>
            <Route path="/"               element={<Home />} />
            <Route path="/cars"           element={<Listings />} />
            <Route path="/cars/:id"       element={<CarDetail />} />
            <Route path="/listing/:id"    element={<CarDetail />} />
            <Route path="/login"          element={<Login />} />
            <Route path="/register"       element={<Register />} />
            <Route path="/sell"           element={<ListCar />} />
            <Route path="/checkout/:id"   element={<Checkout />} />
            <Route path="/dashboard/seller" element={<SellerDashboard />} />
            <Route path="/dashboard/buyer"  element={<BuyerDashboard />} />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  )
}
