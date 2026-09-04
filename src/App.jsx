import React from 'react'
import Header from './components/Header'
import Herosection from './components/Herosection'
import Socialmedia from './components/Socialmedia'
import Footer from './components/footer'

const App = () => {
  return (
    <div className='bg-black h-screen text-white font-mono'>
      <Header/>
      <Herosection/>
      <Socialmedia/>
      <Footer/>
    </div>
  )
}

export default App