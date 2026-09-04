import React from 'react'
import Header from './components/Header'
import Herosection from './components/Herosection'
import Socialmedia from './components/Socialmedia'
import Footer from './components/Footer'
import LoadingScreen from './effects/Loadingscreen'

const App = () => {
  return (
    <div className='relative min-h-screen text-white font-mono overflow-x-hidden'>

      {/* shared background — sits behind everything, no per-section seams */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/15 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* actual page content — must sit above the background */}
      <div className="relative z-10">
        <LoadingScreen minDuration={1200} />
        <Header />
        <Herosection />
        <Socialmedia />
        <Footer />
      </div>
    </div>
  )
}

export default App