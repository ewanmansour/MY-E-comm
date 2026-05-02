import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContextValue'

const PlaceOrder = () => {
    const { currency, delivery_fee, getCartAmount, placeOrder, user } = useContext(ShopContext);
    const navigate = useNavigate();
    const [method, setMethod] = useState('COD');
    const [placing, setPlacing] = useState(false);
    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        phone: '',
    });

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submitOrder = async (event) => {
        event.preventDefault();

        if (!user) {
            toast.info('Please login to place your order.');
            navigate('/login', { state: { from: '/place-order' } });
            return;
        }

        if (getCartAmount() === 0) {
            navigate('/cart');
            return;
        }

        setPlacing(true);

        try {
            await placeOrder(form, method);
            toast.success('Order placed successfully.');
            navigate('/orders');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setPlacing(false);
        }
    };

    const subtotal = getCartAmount();
    const total = subtotal === 0 ? 0 : subtotal + delivery_fee;

    return (
        <form onSubmit={submitOrder} className='flex min-h-[80vh] flex-col justify-between gap-8 border-t pt-10 sm:flex-row'>
            <div className='flex w-full flex-col gap-4 sm:max-w-[480px]'>
                <div className='mb-3 text-xl sm:text-2xl'>
                    <Title text1='DELIVERY' text2='INFORMATION' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={(event) => updateField('firstName', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='text' placeholder='First name' />
                    <input required onChange={(event) => updateField('lastName', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='text' placeholder='Last name' />
                </div>
                <input required onChange={(event) => updateField('email', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='email' placeholder='Email address' />
                <input required onChange={(event) => updateField('street', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='text' placeholder='Street' />
                <div className='flex gap-3'>
                    <input required onChange={(event) => updateField('city', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='text' placeholder='City' />
                    <input required onChange={(event) => updateField('state', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='text' placeholder='State' />
                </div>
                <div className='flex gap-3'>
                    <input required onChange={(event) => updateField('zipcode', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='text' placeholder='Zipcode' />
                    <input required onChange={(event) => updateField('country', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='text' placeholder='Country' />
                </div>
                <input required onChange={(event) => updateField('phone', event.target.value)} className='w-full border border-gray-300 px-3 py-2' type='text' placeholder='Phone' />
            </div>

            <div className='mt-8 min-w-80'>
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

                <div className='mt-10'>
                    <Title text1='PAYMENT' text2='METHOD' />
                    <div className='mt-4 flex flex-col gap-3 lg:flex-row'>
                        {['COD'].map((item) => (
                            <button
                                key={item}
                                type='button'
                                onClick={() => setMethod(item)}
                                className={`border px-4 py-3 text-sm ${method === item ? 'border-black bg-gray-100' : 'border-gray-300'}`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>
                    <button disabled={placing} type='submit' className='mt-8 w-full bg-[#2f2426] px-8 py-3 text-sm text-white disabled:bg-gray-400'>
                        {placing ? 'PLACING ORDER...' : user ? 'PLACE ORDER' : 'LOGIN TO PLACE ORDER'}
                    </button>
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
