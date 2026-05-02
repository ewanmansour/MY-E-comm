import React, { useContext, useMemo, useState } from 'react'
import { ShopContext } from '../context/ShopContextValue'
import { assets } from '../assets/assets';
import Title from '../components/Title';
import ProductItem from '../components/ProductItem';
import ScrollReveal from '../components/ScrollReveal';



const Collections = () => {

    const { products, search, showSearch } = useContext(ShopContext);
    const [showFilter, setShowFilter] = useState(false);
    const [category, setCategory] = useState([]);
    const [subcategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relavent');

    const categories = ['Makeup', 'Skincare'];
    const subCategories = ['Serums', 'Lips', 'Face', 'SPF', 'Cleansers', 'Moisturizers'];


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
            productCopy = productCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
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

    return (
        <div className='flex flex-col gap-1 border-t border-[#dce8df] pt-10 sm:flex-row sm:gap-10'>
            {/* -----filter options----- */}
            <div className='min-w-60'>
                <p onClick={() => setShowFilter(!showFilter)} className='my-2 flex cursor-pointer items-center gap-2 text-xl text-[#2f2426]'>FILTERS
                    <img className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''} `} src={assets.dropdown_icon} alt="" />
                </p>
                {/* -------category filter----- */}
                <div className={`mt-6 border border-[#dce8df] bg-white px-4 py-5 ${showFilter ? '' : 'hidden'} sm:block`}>
                    <p className='mb-3 text-sm font-medium'>CATEGORIES</p>
                    <div className='flex flex-col gap-2 text-sm font-light text-[#665153]'>
                        {categories.map((item) => (
                            <label key={item} className='flex gap-2'>
                                <input type="checkbox" value={item} className='w-3 accent-[#5f7f72]' onChange={toggleCategory} />
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
                                <input type="checkbox" value={item} className='w-3 accent-[#5f7f72]' onChange={toggleSubCategory} />
                                {item}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            {/* -------- right side -------- */}
            <div className='flex-1'>
                <div className='mb-4 flex justify-between text-base sm:text-2xl'>
                    <Title text1={'BEAUTY'} text2={'COLLECTION'} />
                    <select onChange={(e) => setSortType(e.target.value)} className='border border-[#c9d8ce] bg-white px-3 text-sm outline-none'>
                        <option value="relavent">Sort by : Relevant</option>
                        <option value="low-high">Sort by : Low to High</option>
                        <option value="high-low">Sort by : High to Low</option>
                    </select>
                </div>
                {/* ------- products ------- */}
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                    {
                        filterProducts.map((item, index) => (
                            <ScrollReveal key={item._id || index} delay={(index % 5) * 60}>
                                <ProductItem id={item._id} name={item.name} price={item.price} image={item.image} />
                            </ScrollReveal>
                        ))
                    }

                </div>

            </div>

        </div>
    )
}

export default Collections
