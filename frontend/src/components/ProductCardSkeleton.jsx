import React from 'react'

const ProductCardSkeleton = () => {
    return (
        <div className='animate-pulse'>
            <div className='aspect-3/4 border border-[#dce8df] bg-[#e8f0eb]'></div>
            <div className='mt-3 h-3 w-4/5 bg-[#dce8df]'></div>
            <div className='mt-2 h-3 w-1/3 bg-[#dce8df]'></div>
        </div>
    )
}

export default ProductCardSkeleton
