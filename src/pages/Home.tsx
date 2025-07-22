import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Pagination, Autoplay } from 'swiper/modules';
import { useStore } from '../store/zustandStore';
import { useSelector } from 'react-redux';
import { IRootState } from '../store';
import CategoryItem from '../components/Home/CategoryItem';

import { HeartIcon, ShoppingCart } from 'lucide-react';
import { MdAddShoppingCart, MdOutlineAddShoppingCart } from 'react-icons/md';
import ProductCard from '../components/Home/ProductCard';

const Home = () => {
    const items = ['carousel1.jpeg', 'carousel2.jpeg', 'carousel3.jpeg'];

    const themeConfig = useSelector((state: IRootState) => state.themeConfig);
    // const [selectedCategory, setSelectedCategory] = useState('all');

    const categories = [
        {
            Id: 'all',
            Name: 'All',
        },
        {
            Id: 'fruits',
            Name: 'Fruits',
        },
        {
            Id: 'vegetables',
            Name: 'Vegetables',
        },
        {
            Id: 'dairy',
            Name: 'Dairy',
        },
        {
            Id: 'meat',
            Name: 'Meat & Poultry',
        },
        {
            Id: 'seafood',
            Name: 'Seafood',
        },
        {
            Id: 'grains',
            Name: 'Grains & Pasta',
        },
        {
            Id: 'snacks',
            Name: 'Snacks',
        },
        {
            Id: 'beverages',
            Name: 'Beverages',
        },
        {
            Id: 'condiments',
            Name: 'Condiments & Sauces',
        },
        {
            Id: 'desserts',
            Name: 'Desserts',
        },
    ];

    return (
        <div>
            {/* <h2 className="text-xl mb-4">Home</h2> */}
            <div className=" relative">
                <Swiper
                    modules={[Pagination, Autoplay]}
                    pagination={{ clickable: true }}
                    autoplay={{ delay: 1000 }}
                    direction="vertical"
                    className="w-full max-h-[300px] mx-auto mb-2 rounded-lg "
                    id="slider3"
                    dir={themeConfig.rtlClass}
                    key={themeConfig.rtlClass === 'rtl' ? 'true' : 'false'}
                >
                    <div className="swiper-wrapper">
                        {items.map((item, i) => {
                            return (
                                <SwiperSlide key={i}>
                                    <img src={`/assets/images/${item}`} className="w-full h-full object-cover" alt="itemImage" />
                                    <div className="absolute z-[999] text-white top-1/2 left-1/2 w-full -translate-x-1/2 text-center">
                                        <div className="sm:text-xl text-base font-medium">Lorem Ipsum is simply dummy text of the printing.</div>
                                    </div>
                                </SwiperSlide>
                            );
                        })}
                    </div>
                </Swiper>
            </div>

            <div className="mx-auto  rounded-lg px-2 dark:text-white">
                <h2 className="text-2xl font-extrabold px-2 py-1">Categories</h2>
                <div className="categorySlider overflow-auto flex flex-row gap-4 py-2">
                    {categories.map((cat) => (
                        <CategoryItem title={cat.Name} id={cat.Id} key={cat.Id} />
                    ))}
                </div>
            </div>

            {/* Products Grid */}
            <div className="grid xl:grid-cols-5  md:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3 sm:gap-4 py-4">
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
                <ProductCard img={'vegitables.png'} />
            </div>
        </div>
    );
};

export default Home;
