import React from 'react'

const Herosection = () => {
  return (
    <div className=' bg-black'>
        {/* IMAGE */}
        <div className='mt-12 w-full flex justify-center'>
          <div className='relative'>
            <img
              src="https://v0-chirayu-durgude.vercel.app/profile.png"
              alt=""
              className='w-76 h-90 rounded-4xl object-cover shadow-2xl shadow-white/50'
            />
          </div>
        </div>

        {/* TEXT */}
        <div className='flex flex-col gap-2'>
            <div className='flex justify-center mt-5 text-3xl font-bold tracking-tighter'>
                <p className='uppercase text-white'>Chirayu Durgude</p>
            </div>
            <div className='flex justify-center tracking-widest'>
                <p className='uppercase inline-block border-b-2 border-green-400 pb-1 text-white'>
                  Technical head
                </p>
            </div>
            <div className='flex justify-center text-gray-400'>
                <p className='uppercase'>Training & Placement Cell</p>
            </div>
        </div>
    </div>
  )
}

export default Herosection