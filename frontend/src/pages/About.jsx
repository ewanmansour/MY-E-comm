import React from 'react'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ScrollReveal from '../components/ScrollReveal'

const About = () => {
    return (
        <div className='border-t pt-10'>
            <ScrollReveal>
                <div className='mb-10 text-2xl'>
                    <Title text1='ABOUT' text2='US' />
                </div>

                <div className='grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center'>
                    <div className='overflow-hidden border border-gray-200 bg-white'>
                        <img src={assets.about_img} alt='Beauty essentials' className='h-full min-h-[360px] w-full object-cover' />
                    </div>

                    <div className='bg-white px-6 py-8 text-gray-700 soft-shadow sm:px-10'>
                        <p className='mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-[#5f7f72]'>Built for beauty routines</p>
                        <h1 className='prata-regular mb-6 text-4xl leading-tight text-gray-950'>Modern formulas, easy shopping, real product control.</h1>
                        <div className='flex flex-col gap-4 text-sm leading-7 sm:text-base'>
                            <p>
                                Luma Beauty is a clean cosmetics storefront designed to make browsing, filtering, and checkout feel simple. Products are organized by category, type, shade or option, and bestseller status so customers can move quickly from discovery to cart.
                            </p>
                            <p>
                                The store connects to a Node and PostgreSQL backend, which means beauty product data can be managed from the admin dashboard without editing frontend files.
                            </p>
                        </div>
                    </div>
                </div>
            </ScrollReveal>

            <ScrollReveal>
                <div className='my-16 grid gap-4 sm:grid-cols-3'>
                    {[
                        ['Curated stock', 'Focused edits across makeup, skincare, and routine essentials.'],
                        ['Fast management', 'Add and delete products from a protected dashboard.'],
                        ['AI guidance', 'A shopping assistant helps users choose shades and routines faster.'],
                    ].map(([title, text]) => (
                        <div key={title} className='border border-gray-200 bg-white p-6'>
                            <p className='mb-3 text-lg font-semibold text-gray-950'>{title}</p>
                            <p className='text-sm leading-6 text-gray-600'>{text}</p>
                        </div>
                    ))}
                </div>
            </ScrollReveal>

            <ScrollReveal>
                <div className='mb-10 border border-[#dce8df] bg-[#2f2426] px-6 py-10 text-white sm:px-10'>
                    <div className='grid gap-8 md:grid-cols-[1fr_1fr] md:items-center'>
                        <div>
                            <p className='mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#b7d9ca]'>Our promise</p>
                            <h2 className='prata-regular text-3xl'>Clear formulas, clear prices, and helpful support.</h2>
                        </div>
                        <p className='text-sm leading-7 text-gray-200'>
                            We keep the shopping journey focused: clear product pages, simple cart controls, delivery information, and order tracking. The goal is a beauty store that looks polished and stays easy to operate.
                        </p>
                    </div>
                </div>
            </ScrollReveal>
        </div>
    )
}

export default About
