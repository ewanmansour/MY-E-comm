import React from 'react'

const Title = ({ text1, text2 }) => {
    return (
        <div className='mb-3 inline-flex items-center gap-2'>
            <p className='text-[#6f7c73]'>{text1} <span className='font-medium text-[#2f2426]'>{text2}</span></p>
            <p className='h-[1.5px] w-8 bg-[#5f7f72] sm:w-12'></p>
        </div>
    )
}

export default Title
