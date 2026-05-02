import React from 'react'

const NewsLetterBox = () => {

    const onSubmitHandler = (event) => {
        event.preventDefault();
    }

    return (
        <div className='border border-gray-200 bg-white px-5 py-12 text-center soft-shadow'>
            <p className='text-2xl font-medium text-gray-800'>Subscribe and get 20% off</p>
            <p className='mt-3 text-gray-500'>New shades, skincare drops, and restocks in your inbox.</p>
            <form onSubmit={onSubmitHandler} className='mx-auto my-6 flex w-full items-center gap-3 border border-gray-300 bg-white pl-3 sm:w-1/2'>
                <input className='w-full bg-transparent outline-none sm:flex-1' type='email' placeholder='Enter your email' />
                <button type='submit' className='bg-black text-white text-xs px-10 py-4'>SUBSCRIBE</button>
            </form>
        </div>
    )
}

export default NewsLetterBox
