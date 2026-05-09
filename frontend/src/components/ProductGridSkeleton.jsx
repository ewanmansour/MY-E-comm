import React from 'react'
import ProductCardSkeleton from './ProductCardSkeleton'

const ProductGridSkeleton = ({ count = 10 }) => {
    return (
        <div className='grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
            {Array.from({ length: count }).map((_, index) => (
                <ProductCardSkeleton key={index} />
            ))}
        </div>
    )
}

export default ProductGridSkeleton
