import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContextValue'
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {

    const { currency } = useContext(ShopContext);

    return (
        <Link className='group cursor-pointer text-[#665153]' to={`/product/${id}`}>
            <div className='overflow-hidden border border-[#dce8df] bg-white'>
                <img loading='lazy' className='aspect-3/4 w-full object-cover transition duration-500 ease-out group-hover:scale-105' src={image[0]} alt="" />
            </div>
            <p className='pt-3 pb-1 text-sm text-[#3d3032]'>{name}</p>
            <p className='text-sm font-semibold text-[#2f2426]'>{currency}{price}</p>
        </Link>
    )
}

export default ProductItem
