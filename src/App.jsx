import React, { useEffect } from 'react'
import Header from './components/Header'
import Herosection from './components/Herosection'
import Socialmedia from './components/Socialmedia'
import Footer from './components/Footer'
import LoadingScreen from './effects/Loadingscreen'
import ThreeBackground from './effects/ThreeBackground'
import { members, getMemberById } from './data/members'

// "/2" -> member with id 2; "/" -> first member in the CSV.
const resolveMember = () => {
  const id = window.location.pathname.replace(/^\/+|\/+$/g, '')
  return id ? getMemberById(id) : members[0]
}

const App = () => {
  const member = resolveMember()
  useEffect(() => {
    document.title = member ? `${member.name} · TPC ID` : 'ID not found · TPC ID'
  }, [member])

  return (
    <div className='relative min-h-screen text-white font-mono overflow-x-hidden bg-black'>
      {/* 3D WebGL Background Scene with floating particles and cyber geometry */}
      <ThreeBackground />

      {/* Ambient background glow & digital grid accents */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        <div className="absolute top-1/4 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/3 -left-24 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Actual page content sitting in front of 3D canvas */}
      <div className="relative z-10">
        <LoadingScreen minDuration={1200} />
        <Header member={member} />
        {member ? (
          <>
            <Herosection member={member} />
            <Socialmedia member={member} />
          </>
        ) : (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2 px-4 text-center">
            <p className="text-green-400 text-sm font-bold tracking-widest uppercase">ID not found</p>
            <p className="text-neutral-400 text-xs">No member exists at this link.</p>
          </div>
        )}
        <Footer />
      </div>
    </div>
  )
}

export default App