import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContextValue'
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price, category, subCategory, bestseller, newArrival = false }) => {

    const { currency } = useContext(ShopContext);

    return (
        <Link className='group block cursor-pointer text-[#665153]' to={`/product/${id}`} aria-label={`View ${name}`}>
            <div className='relative overflow-hidden border border-[#dce8df] bg-white'>
                <div className='absolute left-2 top-2 z-10 flex flex-wrap gap-1'>
                    {bestseller && <span className='bg-[#2f2426] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white'>Best</span>}
                    {newArrival && <span className='bg-[#5f7f72] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white'>New</span>}
                </div>
                <img loading='lazy' className='aspect-3/4 w-full object-cover transition duration-500 ease-out group-hover:scale-105' src={image[0]} alt="" />
                <span className='absolute inset-x-3 bottom-3 translate-y-2 bg-white/95 px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-[#2f3430] opacity-0 shadow-sm transition duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
                    View details
                </span>
            </div>
            <p className='pt-3 pb-1 text-sm font-medium text-[#3d3032]'>{name}</p>
            {(category || subCategory) && <p className='pb-1 text-xs text-[#6f7c73]'>{category} {subCategory ? `/ ${subCategory}` : ''}</p>}
            <p className='text-sm font-semibold text-[#2f2426]'>{currency}{price}</p>
        </Link>
    )
}

export default ProductItem
