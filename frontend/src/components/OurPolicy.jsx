import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
    return (
        <div className='grid gap-4 py-16 text-center text-xs text-gray-700 sm:grid-cols-3 sm:text-sm md:text-base'>
            <div className='border border-[#dce8df] bg-white px-5 py-8'>
                <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
                <p className='font-semibold'>Easy Exchange Policy</p>
                <p className='text-gray-400'>Simple swaps on eligible fashion items.</p>
            </div>
            <div className='border border-[#dce8df] bg-white px-5 py-8'>
                <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
                <p className='font-semibold'>7 Days Return Policy</p>
                <p className='text-gray-400'>Simple returns within one week.</p>
            </div>
            <div className='border border-[#dce8df] bg-white px-5 py-8'>
                <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
                <p className='font-semibold'>Style Support</p>
                <p className='text-gray-400'>Help with orders, sizes, and outfits.</p>
            </div>
        </div>
    )
}

export default OurPolicy
