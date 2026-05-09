import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import Title from '../components/Title'
import ScrollReveal from '../components/ScrollReveal'
import { sendContactMessage } from '../lib/api'

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [sending, setSending] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const submitContact = async (event) => {
        event.preventDefault();
        setSending(true);

        try {
            await sendContactMessage(form);
            setForm({ name: '', email: '', message: '' });
            toast.success('Message sent successfully.');
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className='border-t pt-10'>
            <ScrollReveal>
                <div className='mb-10 text-2xl'>
                    <Title text1='CONTACT' text2='US' />
                </div>

                <div className='grid gap-10 lg:grid-cols-[1fr_1fr] lg:items-stretch'>
                    <div className='overflow-hidden border border-gray-200 bg-white'>
                        <img src={assets.contact_img} alt='Fashion customer support' className='h-full min-h-[420px] w-full object-cover' />
                    </div>

                    <div className='flex flex-col justify-center bg-white px-6 py-8 soft-shadow sm:px-10'>
                        <p className='mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-[#5f7f72]'>We are here</p>
                        <h1 className='prata-regular mb-6 text-4xl text-gray-950'>Need help with an order, size, or outfit?</h1>
                        <div className='mb-8 grid gap-4 text-sm text-gray-600 sm:grid-cols-2'>
                            <div className='border border-gray-200 p-4'>
                                <p className='mb-2 font-semibold text-gray-950'>Email</p>
                                <p>support@urbanthread.com</p>
                            </div>
                            <div className='border border-gray-200 p-4'>
                                <p className='mb-2 font-semibold text-gray-950'>Phone</p>
                                <p>+20 100 000 0000</p>
                            </div>
                            <div className='border border-gray-200 p-4'>
                                <p className='mb-2 font-semibold text-gray-950'>Hours</p>
                                <p>Sat - Thu, 10 AM - 8 PM</p>
                            </div>
                            <div className='border border-gray-200 p-4'>
                                <p className='mb-2 font-semibold text-gray-950'>Location</p>
                                <p>Cairo, Egypt</p>
                            </div>
                        </div>

                        <form className='grid gap-3' onSubmit={submitContact}>
                            <div className='grid gap-3 sm:grid-cols-2'>
                                <input value={form.name} onChange={(event) => updateField('name', event.target.value)} className='border border-gray-300 px-3 py-3 outline-none focus:border-black' type='text' placeholder='Your name' required />
                                <input value={form.email} onChange={(event) => updateField('email', event.target.value)} className='border border-gray-300 px-3 py-3 outline-none focus:border-black' type='email' placeholder='Email address' required />
                            </div>
                            <textarea value={form.message} onChange={(event) => updateField('message', event.target.value)} className='min-h-32 border border-gray-300 px-3 py-3 outline-none focus:border-black' placeholder='Message' required></textarea>
                            <button disabled={sending} className='w-fit bg-black px-8 py-3 text-sm font-medium text-white disabled:bg-gray-400' type='submit'>
                                {sending ? 'SENDING...' : 'SEND MESSAGE'}
                            </button>
                        </form>
                    </div>
                </div>
            </ScrollReveal>

            <ScrollReveal>
                <div className='my-16 border border-gray-200 bg-white p-6 text-sm leading-7 text-gray-600 sm:p-8'>
                    <p className='font-semibold text-gray-950'>Quick tip</p>
                    <p>
                        You can also use the AI assistant in the bottom corner to ask about sizes, categories, bestsellers, and product recommendations before contacting support.
                    </p>
                </div>
            </ScrollReveal>
        </div>
    )
}

export default Contact
