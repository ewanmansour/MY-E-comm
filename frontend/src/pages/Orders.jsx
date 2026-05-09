import React, { useContext, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContextValue'

const Orders = () => {
    const { orders, currency, user, loadOrders } = useContext(ShopContext);

    useEffect(() => {
        if (user) {
            loadOrders().catch(() => {});
        }
    }, [user, loadOrders])

    return (
        <div className='border-t pt-10'>
            <div className='mb-8 text-2xl'>
                <Title text1='MY' text2='ORDERS' />
            </div>

            {!user ? (
                <div className='py-16 text-center'>
                    <p className='mb-5 text-gray-600'>Please login to see your orders.</p>
                    <Link to='/login' className='inline-block bg-black px-8 py-3 text-sm text-white'>
                        LOGIN
                    </Link>
                </div>
            ) : orders.length === 0 ? (
                <div className='py-16 text-center'>
                    <p className='mb-5 text-gray-600'>No orders yet.</p>
                    <Link to='/collection' className='inline-block bg-[#2f2426] px-8 py-3 text-sm text-white'>
                        START SHOPPING
                    </Link>
                </div>
            ) : (
                <div className='flex flex-col gap-6'>
                    {orders.map((order) => (
                        <div key={order.id} className='border border-gray-200 p-4'>
                            <div className='mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
                                <div>
                                    <p className='font-medium'>{order.id}</p>
                                    <p className='text-sm text-gray-500'>{new Date(order.date).toLocaleString()}</p>
                                </div>
                                <p className='text-sm font-medium text-green-700'>{order.status}</p>
                            </div>

                            <div className='divide-y'>
                                {order.items.map((item) => (
                                    <div key={`${order.id}-${item.productId}-${item.size}`} className='flex items-center gap-4 py-3'>
                                        <img src={item.image[0]} alt={item.name} className='h-16 w-14 object-cover' />
                                        <div className='flex-1'>
                                            <p className='font-medium'>{item.name}</p>
                                            <p className='text-sm text-gray-500'>
                                                {currency}{item.price} | Qty: {item.quantity} | Size: {item.size}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='mt-4 text-right text-sm font-semibold'>
                                Total: {currency}{order.amount}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Orders
