import React, { useContext, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Title from '../components/Title'
import ScrollReveal from '../components/ScrollReveal'
import { ShopContext } from '../context/ShopContextValue'

const Login = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, signup } = useContext(ShopContext);
    const [mode, setMode] = useState('Login');
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submitAuth = async (event) => {
        event.preventDefault();
        setLoading(true);
        setStatus('');

        try {
            if (mode === 'Login') {
                await login({ email: form.email, password: form.password });
            } else {
                await signup(form);
            }

            toast.success(mode === 'Login' ? 'Logged in successfully.' : 'Account created successfully.');
            navigate(location.state?.from || '/');
        } catch (error) {
            setStatus(error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex min-h-[75vh] items-center justify-center border-t py-12'>
            <ScrollReveal className='w-full max-w-5xl'>
                <div className='grid overflow-hidden border border-gray-200 bg-white soft-shadow lg:grid-cols-[0.9fr_1.1fr]'>
                    <div className='hidden bg-[#2f2426] p-10 text-white lg:flex lg:flex-col lg:justify-between'>
                        <div>
                            <p className='mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#b7d9ca]'>Urban Thread account</p>
                            <h1 className='prata-regular text-5xl leading-tight'>Save your orders and checkout faster.</h1>
                        </div>
                        <div className='grid gap-4 text-sm text-gray-200'>
                            <p>Track previous orders from your account.</p>
                            <p>Keep shopping details ready for checkout.</p>
                            <p>Get better size and outfit recommendations from the AI assistant.</p>
                        </div>
                    </div>

                    <form onSubmit={submitAuth} className='p-6 sm:p-10'>
                        <div className='mb-8'>
                            <Title text1={mode === 'Login' ? 'LOGIN' : 'SIGN'} text2={mode === 'Login' ? 'ACCOUNT' : 'UP'} />
                            <p className='mt-2 text-sm text-gray-600'>
                                {mode === 'Login' ? 'Welcome back. Enter your details to continue.' : 'Create an account and start shopping.'}
                            </p>
                        </div>

                        <div className='flex flex-col gap-4'>
                            {mode === 'Sign Up' && (
                                <label className='text-sm'>
                                    Name
                                    <input
                                        value={form.name}
                                        onChange={(event) => updateField('name', event.target.value)}
                                        className='mt-1 w-full border border-gray-300 px-3 py-3 outline-none focus:border-black'
                                        required
                                    />
                                </label>
                            )}
                            <label className='text-sm'>
                                Email
                                <input
                                    value={form.email}
                                    onChange={(event) => updateField('email', event.target.value)}
                                    className='mt-1 w-full border border-gray-300 px-3 py-3 outline-none focus:border-black'
                                    type='email'
                                    required
                                />
                            </label>
                            <label className='text-sm'>
                                Password
                                <input
                                    value={form.password}
                                    onChange={(event) => updateField('password', event.target.value)}
                                    className='mt-1 w-full border border-gray-300 px-3 py-3 outline-none focus:border-black'
                                    type='password'
                                    minLength={4}
                                    required
                                />
                            </label>

                            <button disabled={loading} className='mt-2 bg-[#2f2426] px-4 py-3 text-sm font-medium text-white disabled:bg-gray-400' type='submit'>
                                {loading ? 'Please wait...' : mode === 'Login' ? 'LOGIN' : 'CREATE ACCOUNT'}
                            </button>

                            {status && <p className='text-sm text-red-600'>{status}</p>}

                            <button
                                type='button'
                                onClick={() => {
                                    setMode((current) => current === 'Login' ? 'Sign Up' : 'Login');
                                    setStatus('');
                                }}
                                className='text-left text-sm text-gray-600 hover:text-black'
                            >
                                {mode === 'Login' ? 'Create new account' : 'Already have an account? Login'}
                            </button>
                        </div>
                    </form>
                </div>
            </ScrollReveal>
        </div>
    )
}

export default Login
