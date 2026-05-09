import React, { useContext, useMemo } from 'react'
import { ShopContext } from '../context/ShopContextValue'
import { assets } from '../assets/assets';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchBar = () => {

    const { search, setSearch, showSearch, setShowSearch, products, currency } = useContext(ShopContext);
    const location = useLocation();
    const navigate = useNavigate();
    const isCollection = location.pathname.includes('collection');
    const query = search.trim().toLowerCase();

    const recommendations = useMemo(() => {
        if (!query) return [];

        return products
            .filter((item) => {
                const searchableText = [
                    item.name,
                    item.category,
                    item.subCategory,
                ].join(' ').toLowerCase();

                return searchableText.includes(query);
            })
            .slice(0, 6);
    }, [products, query]);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!isCollection && search.trim()) {
            navigate('/collection');
        }
    };

    const openProduct = (product) => {
        setSearch('');
        setShowSearch(false);
        navigate(`/product/${product._id || product.id}`);
    };

    return (
        <div
            className={`relative z-40 overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
                showSearch ? 'max-h-[520px] translate-y-0 opacity-100' : 'pointer-events-none max-h-0 -translate-y-2 opacity-0'
            }`}
        >
            <div className='border-y border-[#dce8df] bg-[#fbfff9]/95 py-4 shadow-[0_18px_45px_rgba(47,52,48,0.08)] backdrop-blur'>
                <div className='mx-auto w-full max-w-2xl px-2'>
                    <form onSubmit={handleSubmit} className='flex items-center gap-3 border border-[#c9d8ce] bg-white px-4 py-3 shadow-sm transition focus-within:border-[#5f7f72] focus-within:shadow-[0_12px_30px_rgba(95,127,114,0.14)]'>
                        <img src={assets.search_icon} className='w-4 opacity-70' alt="" />
                        <input
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            className='min-w-0 flex-1 bg-transparent text-sm text-[#2f3430] outline-none placeholder:text-[#8a968d]'
                            type="text"
                            placeholder='Search shirts, pants, dresses...'
                            autoFocus={showSearch}
                        />
                        {search && (
                            <button
                                type='button'
                                onClick={() => setSearch('')}
                                className='grid h-7 w-7 place-items-center border border-[#dce8df] text-xs text-[#56665f] transition hover:border-[#5f7f72]'
                                aria-label='Clear search'
                            >
                                X
                            </button>
                        )}
                        <button
                            type='button'
                            onClick={() => setShowSearch(false)}
                            className='grid h-7 w-7 place-items-center'
                            aria-label='Close search'
                        >
                            <img src={assets.cross_icon} className='w-3 opacity-70' alt="" />
                        </button>
                    </form>

                    <div className={`overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${query ? 'mt-3 max-h-80 translate-y-0 opacity-100' : 'max-h-0 -translate-y-2 opacity-0'}`}>
                        <div className='border border-[#dce8df] bg-white shadow-xl'>
                            {recommendations.length > 0 ? (
                                recommendations.map((product) => (
                                    <button
                                        key={product._id || product.id}
                                        type='button'
                                        onClick={() => openProduct(product)}
                                        className='grid w-full grid-cols-[52px_1fr_auto] items-center gap-3 border-b border-[#eef3ef] px-3 py-3 text-left transition last:border-b-0 hover:bg-[#f7faf7]'
                                    >
                                        <img
                                            src={product.image?.[0]}
                                            alt={product.name}
                                            className='h-14 w-12 border border-[#eef3ef] object-cover'
                                        />
                                        <span className='min-w-0'>
                                            <span className='block truncate text-sm font-semibold text-[#2f3430]'>{product.name}</span>
                                            <span className='mt-1 block text-xs text-[#6f7c73]'>{product.category} / {product.subCategory}</span>
                                        </span>
                                        <span className='text-sm font-semibold text-[#2f3430]'>{currency}{product.price}</span>
                                    </button>
                                ))
                            ) : (
                                <div className='px-4 py-5 text-center text-sm text-[#6f7c73]'>
                                    No matching products yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SearchBar
