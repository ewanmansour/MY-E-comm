import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContextValue'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import ScrollReveal from '../components/ScrollReveal';
import EmptyState from '../components/EmptyState';
import ProductGridSkeleton from '../components/ProductGridSkeleton';



const Collections = () => {

    const { products, search, setSearch, showSearch, loadingProducts, productsError } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [category, setCategory] = useState([]);
    const [subcategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relavent');

    const categories = ['Men', 'Women', 'Kids'];
    const subCategories = ['Topwear', 'Bottomwear', 'Winterwear'];


    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value))
        }
        else {
            setCategory(prev => [...prev, e.target.value])
        }
    }
    const toggleSubCategory = (e) => {
        if (subcategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value))
        }
        else {
            setSubCategory(prev => [...prev, e.target.value])
        }
    }

    const filterProducts = useMemo(() => {
        let productCopy = products.slice();

        if (showSearch && search) {
            const query = search.toLowerCase();
            productCopy = productCopy.filter(item => [item.name, item.category, item.subCategory].join(' ').toLowerCase().includes(query))
        }

        if (category.length > 0) {
            productCopy = productCopy.filter(item => category.includes(item.category))
        }
        if (subcategory.length > 0) {
            productCopy = productCopy.filter(item => subcategory.includes(item.subCategory))
        }

        switch (sortType) {
            case 'low-high':
                return productCopy.sort((a, b) => (a.price - b.price));
            case 'high-low':
                return productCopy.sort((a, b) => (b.price - a.price));
            default:
                return productCopy;
        }
    }, [category, products, search, showSearch, sortType, subcategory])

    const activeFilters = [...category, ...subcategory];
    const hasFilters = activeFilters.length > 0 || (showSearch && search.trim());

    const clearFilters = () => {
        setCategory([]);
        setSubCategory([]);
        setSearch('');
        setSortType('relavent');
    };

    return (
        <div className='flex flex-col gap-1 border-t border-[#dce8df] pt-10 sm:flex-row sm:gap-10'>
            {/* -----filter options----- */}
            <div className='min-w-60'>
                <button onClick={() => setShowFilter(!showFilter)} className='my-2 flex cursor-pointer items-center gap-2 text-left text-xl text-[#2f2426]' type='button'>
                    FILTERS
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''} `} src={assets.dropdown_icon} alt="" />
                </button>
                {/* -------category filter----- */}
                <div className={`mt-6 border border-[#dce8df] bg-white px-4 py-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-[#665153]'>
                        {categories.map((item) => (
                            <label key={item} className='flex gap-2'>
                                <input type="checkbox" value={item} checked={category.includes(item)} className='w-3 accent-[#5f7f72]' onChange={toggleCategory} />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>
                {/* -------- subcategory filter --------- */}
                <div className={`mt-6 border border-[#dce8df] bg-white px-4 py-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>TYPE</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-[#665153]'>
                        {subCategories.map((item) => (
                            <label key={item} className='flex gap-2'>
                                <input type="checkbox" value={item} checked={subcategory.includes(item)} className='w-3 accent-[#5f7f72]' onChange={toggleSubCategory} />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {/* -------- right side -------- */}
            <div className='flex-1'>
                <div className='mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
                    <div className='text-base sm:text-2xl'>
                        <Title text1={'ALL'} text2={'CLOTHING'} />
                        <p className='text-sm text-[#6f7c73]'>{loadingProducts ? 'Loading products...' : `${filterProducts.length} product${filterProducts.length === 1 ? '' : 's'} found`}</p>
                    </div>
                    <select value={sortType} onChange={(e) => setSortType(e.target.value)} className='h-10 border border-[#c9d8ce] bg-white px-3 text-sm outline-none'>
                        <option value="relavent">Sort by : Relevant</option>
                        <option value="low-high">Sort by : Low to High</option>
                        <option value="high-low">Sort by : High to Low</option>
                    </select>
                </div>
                {activeFilters.length > 0 && (
                    <div className='mb-5 flex flex-wrap items-center gap-2'>
                        {activeFilters.map((item) => (
                            <button
                                key={item}
                                type='button'
                                onClick={() => {
                                    setCategory((current) => current.filter((value) => value !== item));
                                    setSubCategory((current) => current.filter((value) => value !== item));
                                }}
                                className='border border-[#c9d8ce] bg-white px-3 py-2 text-xs font-medium text-[#2f3430] transition hover:border-[#5f7f72]'
                            >
                                {item} x
                            </button>
                        ))}
                        <button type='button' onClick={clearFilters} className='px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#5f7f72]'>
                            Clear filters
                        </button>
                    </div>
                )}
                {productsError && (
                    <div className='mb-5 border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800'>
                        Backend is not connected, so local demo products are being shown.
                    </div>
                )}
                {/* ------- products ------- */}
                {loadingProducts ? (
                    <ProductGridSkeleton />
                ) : filterProducts.length === 0 ? (
                    <EmptyState
                        title='No products found'
                        message='Try another search term or clear the selected filters.'
                        actionText={hasFilters ? 'Clear filters' : undefined}
                        onAction={hasFilters ? clearFilters : undefined}
                    />
                ) : (
                    <div className='grid grid-cols-2 gap-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                        {filterProducts.map((item, index) => (
                            <ScrollReveal key={item._id || index} delay={(index % 5) * 60}>
                                <ProductItem {...item} id={item._id} />
                            </ScrollReveal>
                        ))}
                    </div>
                )}

            </div>

        </div>
    )
}

export default Collections
