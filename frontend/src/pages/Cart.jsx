import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContextValue'
import { assets } from '../assets/assets'

const Cart = () => {
    const { products, currency, cartItems, updateQuantity, getCartAmount, delivery_fee } = useContext(ShopContext);

    const cartData = useMemo(() => {
        const items = [];

        for (const productId in cartItems) {
            const product = products.find((item) => item._id === productId || String(item.id) === productId);
            if (!product) continue;

            for (const size in cartItems[productId]) {
                items.push({
                    ...product,
                    size,
                    quantity: cartItems[productId][size],
                });
            }
        }

        return items;
    }, [cartItems, products]);

    const subtotal = getCartAmount();
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

    return (
        <div className='border-t pt-10'>
            <div className='mb-3 text-2xl'>
                <Title text1='YOUR' text2='CART' />
            </div>

            {cartData.length === 0 ? (
                <div className='py-16 text-center'>
                    <p className='mb-5 text-gray-600'>Your cart is empty.</p>
                    <Link to='/collection' className='inline-block bg-[#2f2426] px-8 py-3 text-sm text-white'>
                        SHOP BEAUTY
                    </Link>
                </div>
            ) : (
                <>
                    <div>
                        {cartData.map((item) => (
                            <div key={`${item._id}-${item.size}`} className='grid grid-cols-[4fr_1fr_0.5fr] items-center gap-4 border-b py-4 text-gray-700 sm:grid-cols-[4fr_2fr_0.5fr]'>
                                <div className='flex items-start gap-6'>
                                    <img className='w-16 sm:w-20' src={item.image[0]} alt={item.name} />
                                    <div>
                                        <p className='text-sm font-medium sm:text-lg'>{item.name}</p>
                                        <div className='mt-2 flex items-center gap-5'>
                                            <p>{currency}{item.price}</p>
                                            <p className='border border-[#dce8df] bg-[#f7faf7] px-2 sm:px-3 sm:py-1'>{item.size}</p>
                                        </div>
                                    </div>
                                </div>
                                <input
                                    onChange={(event) => updateQuantity(item._id, item.size, event.target.value)}
                                    className='max-w-10 border px-1 py-1 sm:max-w-20 sm:px-2'
                                    type='number'
                                    min={1}
                                    value={item.quantity}
                                />
                                <img
                                    onClick={() => updateQuantity(item._id, item.size, 0)}
                                    className='mr-4 w-4 cursor-pointer sm:w-5'
                                    src={assets.bin_icon}
                                    alt='Remove'
                                />
                            </div>
                        ))}
                    </div>

                    <div className='my-20 flex justify-end'>
                        <div className='w-full sm:w-[450px]'>
                            <div className='mb-4 text-2xl'>
                                <Title text1='CART' text2='TOTALS' />
                            </div>
                            <div className='flex flex-col gap-2 text-sm'>
                                <div className='flex justify-between'>
                                    <p>Subtotal</p>
                                    <p>{currency}{subtotal}</p>
                                </div>
                                <hr />
                                <div className='flex justify-between'>
                                    <p>Shipping Fee</p>
                                    <p>{currency}{delivery_fee}</p>
                                </div>
                                <hr />
                                <div className='flex justify-between'>
                                    <b>Total</b>
                                    <b>{currency}{total}</b>
                                </div>
                            </div>
                            <div className='w-full text-end'>
                                <Link to='/place-order' className='mt-8 inline-block bg-[#2f2426] px-8 py-3 text-sm text-white'>
                                    PROCEED TO CHECKOUT
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Cart
