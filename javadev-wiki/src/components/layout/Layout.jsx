import { Outlet, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import ScrollToTop from '../ui/ScrollToTop'

export default function Layout() {
  const location = useLocation()

  return (
    <>
      <Navbar />
      {/*
        key forces remount on route change → restarts animate-fade-in.
        Stays outside Navbar/Footer so only the content area transitions.
      */}
      <main
        key={location.pathname}
        className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in"
      >
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  )
}
