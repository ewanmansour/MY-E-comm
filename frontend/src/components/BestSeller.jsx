import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContextValue'
import Title from './Title';
import ProductItem from './ProductItem';
import ProductGridSkeleton from './ProductGridSkeleton';

const BestSeller = () => {

    const { products, loadingProducts } = useContext(ShopContext);
    const bestSeller = useMemo(() => {
        const bestProduct = products.filter((item) => item.bestseller);
        return bestProduct.slice(0, 5);
    }, [products]);

    return (
        <div className='my-14'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLERS'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Customer-style favorites across shirts, dresses, pants, and easy outerwear.
                </p>
            </div>
            {loadingProducts ? (
                <ProductGridSkeleton count={5} />
            ) : (
                <div className='grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                    {bestSeller.map((item, index) => (
                        <ProductItem key={index} {...item} id={item._id} />
                    ))}
                </div>
            )}

        </div>
    )
}

export default BestSeller
