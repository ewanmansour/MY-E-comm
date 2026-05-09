import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContextValue'
import { assets } from '../assets/assets'
import EmptyState from '../components/EmptyState'

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
    const removeItem = (item) => {
        const confirmed = window.confirm(`Remove ${item.name} (${item.size}) from your cart?`);
        if (confirmed) {
            updateQuantity(item._id, item.size, 0);
        }
    };

    return (
        <div className='border-t pt-10'>
            <div className='mb-3 text-2xl'>
                <Title text1='YOUR' text2='CART' />
            </div>

            {cartData.length === 0 ? (
                <EmptyState
                    title='Your cart is empty'
                    message='Start with a new drop or bestseller and your selected sizes will show here.'
                    actionText='Shop clothing'
                    actionTo='/collection'
                />
            ) : (
                <>
                    <div className='grid gap-8 lg:grid-cols-[1fr_360px]'>
                        <div>
                        {cartData.map((item) => (
                            <div key={`${item._id}-${item.size}`} className='grid grid-cols-[1fr_auto] items-center gap-4 border-b border-[#dce8df] bg-white/60 py-4 text-gray-700 sm:grid-cols-[1fr_150px_auto] sm:px-3'>
                                <div className='flex items-start gap-6'>
                                    <img className='w-16 border border-[#dce8df] object-cover sm:w-20' src={item.image[0]} alt={item.name} />
                                    <div>
                                        <Link to={`/product/${item._id}`} className='text-sm font-medium text-[#2f3430] hover:text-[#5f7f72] sm:text-lg'>{item.name}</Link>
                                        <div className='mt-2 flex items-center gap-5'>
                                            <p>{currency}{item.price}</p>
                                            <p className='border border-[#dce8df] bg-[#f7faf7] px-2 sm:px-3 sm:py-1'>{item.size}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex items-center border border-[#dce8df] bg-white'>
                                    <button type='button' disabled={item.quantity <= 1} onClick={() => updateQuantity(item._id, item.size, item.quantity - 1)} className='h-9 w-9 text-lg text-[#2f3430] disabled:text-gray-300' aria-label={`Decrease ${item.name}`}>
                                        -
                                    </button>
                                    <input
                                        onChange={(event) => updateQuantity(item._id, item.size, event.target.value)}
                                        className='h-9 w-10 border-x border-[#dce8df] text-center outline-none'
                                        type='number'
                                        min={1}
                                        value={item.quantity}
                                    />
                                    <button type='button' onClick={() => updateQuantity(item._id, item.size, item.quantity + 1)} className='h-9 w-9 text-lg text-[#2f3430]' aria-label={`Increase ${item.name}`}>
                                        +
                                    </button>
                                </div>
                                <button type='button' onClick={() => removeItem(item)} className='grid h-9 w-9 place-items-center border border-[#dce8df] bg-white transition hover:border-red-200 hover:bg-red-50' aria-label={`Remove ${item.name}`}>
                                    <img className='w-4' src={assets.bin_icon} alt='' />
                                </button>
                            </div>
                        ))}
                        </div>

                        <div className='h-fit border border-[#dce8df] bg-white p-5 shadow-sm lg:sticky lg:top-28'>
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
                            <div className='w-full'>
                                <Link to='/place-order' className='mt-8 block bg-[#2f2426] px-8 py-3 text-center text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-[#5f7f72]'>
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
