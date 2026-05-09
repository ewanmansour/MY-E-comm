import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Title from '../components/Title'
import { ShopContext } from '../context/ShopContextValue'

const validators = {
    firstName: (value) => value.trim() ? '' : 'First name is required.',
    lastName: (value) => value.trim() ? '' : 'Last name is required.',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address.',
    street: (value) => value.trim().length >= 5 ? '' : 'Street address is required.',
    city: (value) => value.trim() ? '' : 'City is required.',
    state: (value) => value.trim() ? '' : 'State is required.',
    zipcode: (value) => value.trim().length >= 3 ? '' : 'Zipcode is required.',
    country: (value) => value.trim() ? '' : 'Country is required.',
    phone: (value) => /^[0-9+\-\s()]{7,}$/.test(value.trim()) ? '' : 'Enter a valid phone number.',
};

const Field = ({ name, label, value, error, onChange, type = 'text', className = '' }) => (
    <label className={`block w-full text-sm ${className}`}>
        <span className='sr-only'>{label}</span>
        <input
            value={value}
            onChange={(event) => onChange(name, event.target.value)}
            className={`w-full border px-3 py-3 outline-none transition ${error ? 'border-red-300 bg-red-50' : 'border-[#dce8df] bg-white focus:border-[#5f7f72]'}`}
            type={type}
            placeholder={label}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${name}-error` : undefined}
        />
        {error && <span id={`${name}-error`} className='mt-1 block text-xs text-red-600'>{error}</span>}
    </label>
);

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
    const [errors, setErrors] = useState({});

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
        setErrors((current) => ({ ...current, [field]: validators[field]?.(value) || '' }));
    };

    const validateForm = () => {
        const nextErrors = Object.fromEntries(
            Object.entries(validators).map(([field, validate]) => [field, validate(form[field] || '')])
        );
        setErrors(nextErrors);
        return Object.values(nextErrors).every((error) => !error);
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

        if (!validateForm()) {
            toast.info('Please fix the delivery information.');
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
                    <Field name='firstName' label='First name' value={form.firstName} error={errors.firstName} onChange={updateField} />
                    <Field name='lastName' label='Last name' value={form.lastName} error={errors.lastName} onChange={updateField} />
                </div>
                <Field name='email' label='Email address' value={form.email} error={errors.email} onChange={updateField} type='email' />
                <Field name='street' label='Street' value={form.street} error={errors.street} onChange={updateField} />
                <div className='flex gap-3'>
                    <Field name='city' label='City' value={form.city} error={errors.city} onChange={updateField} />
                    <Field name='state' label='State' value={form.state} error={errors.state} onChange={updateField} />
                </div>
                <div className='flex gap-3'>
                    <Field name='zipcode' label='Zipcode' value={form.zipcode} error={errors.zipcode} onChange={updateField} />
                    <Field name='country' label='Country' value={form.country} error={errors.country} onChange={updateField} />
                </div>
                <Field name='phone' label='Phone' value={form.phone} error={errors.phone} onChange={updateField} />
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
                                className={`border px-4 py-3 text-sm ${method === item ? 'border-[#2f2426] bg-[#e8f0eb]' : 'border-[#dce8df] bg-white'}`}
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
