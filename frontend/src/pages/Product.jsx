import React, { useContext, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContextValue'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ProductItem from '../components/ProductItem'

const Product = () => {
    const { productId } = useParams();
    const { products, currency, addToCart } = useContext(ShopContext);
    const [image, setImage] = useState('');
    const [size, setSize] = useState('');
    const [message, setMessage] = useState('');

    const productData = useMemo(() => {
        return products.find((item) => item._id === productId || String(item.id) === productId);
    }, [products, productId]);

    const productImage = image || productData?.image?.[0];
    const relatedProducts = productData
        ? products
            .filter((item) => item._id !== productData._id && item.category === productData.category)
            .slice(0, 5)
        : [];

    const handleAddToCart = () => {
        if ((productData.stock ?? 1) <= 0) {
            toast.error('This product is out of stock.');
            return;
        }

        const added = addToCart(productData._id, size);
        setMessage(added ? 'Added to cart.' : 'Please select a shade or option first.');
        toast[added ? 'success' : 'info'](added ? 'Added to cart.' : 'Please select a shade or option first.');
    };

    if (!productData) {
        return (
            <div className='border-t py-20 text-center text-gray-600'>
                Loading product...
            </div>
        )
    }

    return (
        <div className='border-t pt-10'>
            <div className='flex flex-col gap-10 sm:flex-row'>
                <div className='flex flex-1 flex-col-reverse gap-3 sm:flex-row'>
                    <div className='flex justify-between gap-3 overflow-x-auto sm:w-[18%] sm:flex-col sm:justify-normal'>
                        {productData.image.map((item, index) => (
                            <img
                                key={`${item}-${index}`}
                                onClick={() => setImage(item)}
                                src={item}
                                className='w-[24%] cursor-pointer object-cover sm:w-full'
                                alt={productData.name}
                            />
                        ))}
                    </div>
                    <div className='w-full sm:w-[80%]'>
                        <img className='h-auto w-full bg-white object-cover' src={productImage} alt={productData.name} />
                    </div>
                </div>

                <div className='flex-1'>
                    <h1 className='mt-2 text-2xl font-medium'>{productData.name}</h1>
                    <div className='mt-2 flex items-center gap-1'>
                        {[1, 2, 3, 4].map((item) => (
                            <img key={item} src={assets.star_icon} alt='' className='w-3.5' />
                        ))}
                        <img src={assets.star_dull_icon} alt='' className='w-3.5' />
                        <p className='pl-2 text-sm text-gray-500'>(122)</p>
                    </div>
                    <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
                    <p className='mt-5 max-w-xl text-gray-500'>{productData.description}</p>

                    <div className='my-8 flex flex-col gap-4'>
                        <p>Select Shade / Option</p>
                        <div className='flex gap-2'>
                            {productData.sizes.map((item) => (
                                <button
                                    key={item}
                                    onClick={() => setSize(item)}
                                    className={`border px-4 py-2 text-sm ${item === size ? 'border-[#2f2426] bg-[#e8f0eb]' : 'bg-white'}`}
                                    type='button'
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                    </div>
                    <button disabled={(productData.stock ?? 1) <= 0} onClick={handleAddToCart} className='bg-[#2f2426] px-8 py-3 text-sm text-white active:bg-[#5f7f72] disabled:bg-gray-400'>
                        {(productData.stock ?? 1) <= 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                    </button>
                    {message && <p className='mt-3 text-sm text-gray-600'>{message}</p>}
                    <hr className='mt-8 sm:w-4/5' />
                    <div className='mt-5 flex flex-col gap-1 text-sm text-gray-500'>
                        <p>100% original beauty product.</p>
                        <p>Cash on delivery is available on this product.</p>
                        <p>Easy return and eligible shade exchange within 7 days.</p>
                    </div>
                </div>
            </div>

            <div className='my-16'>
                <div className='mb-6 text-2xl'>
                    <Title text1='RELATED' text2='PRODUCTS' />
                </div>
                <div className='grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                    {relatedProducts.map((item) => (
                                <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.image} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Product
