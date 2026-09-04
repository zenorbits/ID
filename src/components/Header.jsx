import React from 'react'

const Header = () => {
    return (
        <div className='md:max-w-sm md:mx-auto'>

            <div className='p-4'>
                <img
                    src="https://v0-chirayu-durgude.vercel.app/tpc-logo.svg"
                    alt="TPCLOGO"
                    className='h-20'
                />
            </div>

            <div className='flex justify-center'>
                <p className='border-1 rounded-full px-8 py-2 items-center text-center absolute top-20'>
                    2026-2027
                </p>
            </div>

        </div>
    )
}

export default Header