import React from 'react'

const Footer = () => {
    return (
        <div>
            <div className='mt-32 grid gap-12 border-t border-[#dce8df] py-10 text-sm sm:grid-cols-[3fr_1fr_1fr]'>
                <div>
                    <div className='mb-5'>
                        <p className='text-xl font-semibold tracking-[0.2em] text-[#2f2426]'>URBAN</p>
                        <p className='text-[10px] font-semibold uppercase tracking-[0.35em] text-[#5f7f72]'>Thread</p>
                    </div>
                    <p className='w-full text-gray-600 md:w-2/3'>
                        A modern fashion storefront for fake clothing products, sizing, checkout, and AI-powered shopping help.
                    </p>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>Home</li>
                        <li>About</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul>
                </div>
                <div>
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-1 text-gray-600'>
                        <li>+20 100 000 0000</li>
                        <li>support@urbanthread.com</li>
                    </ul>
                </div>
            </div>
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2026 Urban Thread - All rights reserved</p>
            </div>
        </div>
    )
}

export default Footer
