import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContextValue'

const Navbar = () => {

    const [visible, setVisible] = useState(false)
    const { showSearch, setShowSearch, getCartCount, user, logout } = useContext(ShopContext);


    const navItems = [
        ['/', 'Home'],
        ['/collection', 'Shop'],
        ['/about', 'About'],
        ['/contact', 'Contact'],
    ];

    const navClass = ({ isActive }) =>
        `px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
            isActive ? 'bg-[#2f2426] text-white shadow-sm' : 'text-[#56665f] hover:bg-white hover:text-[#2f2426]'
        }`;

    return (
        <div className='sticky top-0 z-50 py-4 font-medium'>
            <div className='flex items-center justify-between border border-white/70 bg-[#fbfff9]/90 px-3 py-3 shadow-[0_18px_45px_rgba(85,45,53,0.10)] backdrop-blur md:px-4'>
                <Link to='/' className='flex items-center gap-3' aria-label='Luma Beauty home'>
                    <span className='grid h-10 w-10 place-items-center rounded-full bg-[#2f2426] text-sm font-semibold text-white'>LB</span>
                    <span className='leading-none'>
                        <span className='block text-lg font-semibold tracking-[0.18em] text-[#2f2426]'>LUMA</span>
                        <span className='block text-[10px] font-semibold uppercase tracking-[0.32em] text-[#5f7f72]'>Beauty</span>
                    </span>
                </Link>

                <ul className='hidden items-center bg-[#e8f0eb] p-1 sm:flex'>
                    {navItems.map(([path, label]) => (
                        <NavLink key={path} to={path} className={navClass}>
                            {label}
                        </NavLink>
                    ))}
                </ul>

                <div className='flex items-center gap-2'>
                    <button
                        type='button'
                        onClick={() => setShowSearch(!showSearch)}
                        className='grid h-10 w-10 place-items-center border border-[#dce8df] bg-white transition hover:border-[#2f2426]'
                        aria-label='Search products'
                    >
                        <img className='w-4' src={assets.search_icon} alt="" />
                    </button>

                    <div className='group relative hidden sm:block'>
                        <button
                            type='button'
                            className='grid h-10 w-10 place-items-center border border-[#dce8df] bg-white transition hover:border-[#2f2426]'
                            aria-label='Account menu'
                        >
                            <img className='w-4' src={assets.profile_icon} alt="" />
                        </button>
                        <div className='absolute right-0 z-50 hidden pt-3 group-hover:block'>
                            <div className='flex w-48 flex-col gap-2 border border-[#dce8df] bg-white px-5 py-4 text-sm text-[#56665f] shadow-xl'>
                                {user ? (
                                    <>
                                        <p className='truncate font-semibold text-[#2f2426]'>{user.name}</p>
                                        <Link to='/orders' className='hover:text-[#2f2426]'>Orders</Link>
                                        <button onClick={logout} className='text-left hover:text-[#2f2426]' type='button'>Logout</button>
                                    </>
                                ) : (
                                    <Link to='/login' className='hover:text-[#2f2426]'>Login / Sign up</Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <Link to='/cart' className='relative grid h-10 w-10 place-items-center border border-[#dce8df] bg-white transition hover:border-[#2f2426]' aria-label='Shopping cart'>
                        <img className='w-4 min-w-4' src={assets.cart_icon} alt="" />
                        <span className='absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#5f7f72] px-1 text-[10px] font-semibold text-white'>
                            {getCartCount()}
                        </span>
                    </Link>

                    <button
                        type='button'
                        onClick={() => setVisible(true)}
                        className='grid h-10 w-10 place-items-center border border-[#dce8df] bg-white sm:hidden'
                        aria-label='Open menu'
                    >
                        <img className='w-4' src={assets.menu_icon} alt="" />
                    </button>
                </div>
            </div>

            <div className={`fixed inset-0 z-50 bg-[#2f2426]/30 backdrop-blur-sm transition-opacity sm:hidden ${visible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}>
                <div className={`ml-auto h-full w-[86vw] max-w-sm bg-[#fbfff9] shadow-2xl transition-transform duration-300 ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className='flex items-center justify-between border-b border-[#dce8df] p-5'>
                        <div>
                            <p className='text-lg font-semibold tracking-[0.18em] text-[#2f2426]'>LUMA</p>
                            <p className='text-[10px] font-semibold uppercase tracking-[0.32em] text-[#5f7f72]'>Beauty</p>
                        </div>
                        <button onClick={() => setVisible(false)} className='grid h-9 w-9 place-items-center border border-[#dce8df] bg-white' type='button' aria-label='Close menu'>
                            <img className='h-3 rotate-180' src={assets.dropdown_icon} alt="" />
                        </button>
                    </div>

                    <div className='flex flex-col p-4 text-[#4b3b3d]'>
                        {navItems.map(([path, label]) => (
                            <NavLink key={path} onClick={() => setVisible(false)} className='border-b border-[#dce8df] px-2 py-4 text-sm font-semibold uppercase tracking-[0.16em]' to={path}>
                                {label}
                            </NavLink>
                        ))}
                        {user ? (
                            <>
                                <NavLink onClick={() => setVisible(false)} className='border-b border-[#dce8df] px-2 py-4 text-sm font-semibold uppercase tracking-[0.16em]' to='/orders'>Orders</NavLink>
                                <button onClick={() => { logout(); setVisible(false); }} className='px-2 py-4 text-left text-sm font-semibold uppercase tracking-[0.16em]' type='button'>Logout</button>
                            </>
                        ) : (
                            <NavLink onClick={() => setVisible(false)} className='border-b border-[#dce8df] px-2 py-4 text-sm font-semibold uppercase tracking-[0.16em]' to='/login'>Login</NavLink>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
