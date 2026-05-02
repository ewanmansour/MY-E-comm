import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContextValue'
import { assets } from '../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch } = useContext(ShopContext);
    const location = useLocation();
    const navigate = useNavigate();
    const isCollection = location.pathname.includes('collection');

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearch(value);

        if (value.trim().toLowerCase() === '/admin') {
            sessionStorage.setItem('adminEntryUnlocked', 'true');
            setSearch('');
            setShowSearch(false);
            navigate('/admin');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isCollection && search.trim()) {
            navigate('/collection');
        }
    };

    return showSearch ? (
        <div className='border-y border-[#dce8df] text-center'>
            <form onSubmit={handleSubmit} className='mx-3 my-5 inline-flex w-3/4 items-center justify-center border border-[#c9d8ce] bg-white px-5 py-2 sm:w-1/2'>
                <input value={search} onChange={handleSearchChange} className='flex-1 bg-inherit text-sm outline-none' type="text" placeholder='Search beauty' autoFocus />
                <img src={assets.search_icon} className='w-4' alt="" />
            </form>
            <img onClick={() => setShowSearch(false)} src={assets.cross_icon} className='inline w-3 cursor-pointer' alt="" />
        </div>
    ) : null
}

export default SearchBar
