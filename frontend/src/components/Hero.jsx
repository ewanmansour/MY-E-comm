import React from 'react'
import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Hero = () => {
    return (
        <div className='soft-shadow relative min-h-[560px] overflow-hidden border border-white bg-[#f7faf7]'>
            <img className='absolute inset-0 h-full w-full object-cover object-center' src={assets.hero_img} alt='Luma Beauty skincare and makeup products' />
            <div className='absolute inset-0 bg-linear-to-r from-[#f7faf7] via-[#fff7f3]/82 to-[#fff7f3]/10'></div>

            <div className='relative flex min-h-[560px] items-center px-6 py-16 sm:px-10 lg:px-14'>
                <div className='max-w-xl text-[#2f2426]'>
                    <div className='mb-4 flex items-center gap-3'>
                        <span className='h-[2px] w-10 bg-[#5f7f72]'></span>
                        <p className='text-xs font-semibold uppercase tracking-[0.28em] text-[#5f7f72]'>New beauty edit</p>
                    </div>
                    <h1 className='prata-regular max-w-lg text-5xl leading-tight sm:text-6xl lg:text-7xl'>Skin, shade, glow.</h1>
                    <p className='mt-5 max-w-md text-sm leading-7 text-[#665153] sm:text-base'>
                        Curated skincare and makeup essentials for soft routines, fresh finishes, and fast checkout.
                    </p>
                    <Link to='/collection' className='mt-8 inline-flex items-center gap-3 bg-[#2f2426] px-7 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#5f7f72]'>
                        Shop beauty
                        <span className='h-[2px] w-8 bg-white'></span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Hero
