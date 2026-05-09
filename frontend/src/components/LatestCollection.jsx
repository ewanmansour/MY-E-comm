import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContextValue'
import Title from './Title';
import ProductItem from './ProductItem';
import ProductGridSkeleton from './ProductGridSkeleton';

const LastestCollection = () => {

    const { products, loadingProducts } = useContext(ShopContext);
    const latestProducts = useMemo(() => products.slice(0, 10), [products]);


    return (
        <div className='my-14 border-t border-[#dce8df] pt-12'>
            <div className='text-center py-8 text-3xl'>
                <Title
                    text1={'LATEST'}
                    text2={'DROPS'}
                />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Fresh fake apparel picks selected for everyday outfits, clear sizing, and quick styling.
                </p>
            </div>
            {/* Rendering Products */}
            {loadingProducts ? (
                <ProductGridSkeleton count={10} />
            ) : (
                <div className='grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                    {latestProducts.map((items, index) => (
                        <ProductItem key={index} {...items} id={items._id} newArrival={index < 3} />
                    ))}
                </div>
            )}

        </div>
    )
}

export default LastestCollection
