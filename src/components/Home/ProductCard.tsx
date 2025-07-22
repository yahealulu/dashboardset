import { Rating } from '@mui/material';
import { Heart, ShoppingBag, ShoppingCart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { PropertyAccessEntityNameExpression } from 'typescript';

type propsType = {
    img: string;
};

const ProductCard = (props: propsType) => {
    const [isFavourite, setIsFavourite] = useState(false);
    const [isMobile, setIsMobile] = useState(() => (window.innerWidth <= 450 ? true : false));

    useEffect(() => {
        window.addEventListener('resize', () => {
            if (window.innerWidth <= 450) setIsMobile(true);
            else setIsMobile(false);

            // console.log(window.innerWidth);
        });
    }, []);

    return (
        <div className="group/group1 relative">
            <div className=" productCard rounded-xl min-w-[140px] overflow-hidden p-3 hover:-translate-y-2 hover:shadow-md transition-all bg-white dark:bg-black shadow-md ">
                <div className=" overflow-hidden relative ">
                    <img src={`/assets/images/${props.img}`} className="w-full h-full rounded-t-xl" alt="Product Laptop" />
                    <span className="group/group2 absolute top-2 right-2 sm:p-3 p-2 bg-dark-light rounded-full hover:bg-primary cursor-pointer" title="Add to Cart">
                        <ShoppingBag className="text-primary group-hover/group2:text-white" />
                    </span>
                </div>
                <div className="info ">
                    <div className="name">
                        <h2 className="text-lg  font-semibold pt-1">Trial Product</h2>
                        <div className="flex flex-row gap-2 items-center">
                            <Rating name="read-only" defaultValue={3} readOnly size={isMobile ? 'small' : 'medium'} />
                            <p className="text-gray-400">3</p>
                        </div>
                        <p className=" max-sm:text-sm max-sm:hidden py-1">Lorem, ipsum dolor sit amet consectetur .</p>
                        <div>
                            <strong className="text-lg font-bold py-1">40.9$</strong>
                        </div>
                        {/* <div className="flex-row justify-between items-center py-2 hidden group-hover/group1:flex transition-all">
                            <button className="btn text-primary">See Preview</button>
                            <span className="cursor-pointer" onClick={() => setIsFavourite((prev) => !prev)} title="Add to Favorites">
                                {isFavourite ? <Heart fill="currentColor" /> : <Heart />}
                            </span>
                        </div>  */}
                    </div>
                </div>
            </div>

            <div className="hidden group-hover/group1:block absolute top-0 right-0 left-0 group/group3 productCard rounded-xl min-w-[140px] overflow-hidden p-3 hover:bg-white dark:hover:bg-black hover:-translate-y-2 hover:shadow-md transition-all z-10">
                <div className=" overflow-hidden relative ">
                    <img src={`/assets/images/${props.img}`} className="w-full h-full rounded-t-xl" alt="Product Laptop" />
                    <span className="group/group2 absolute top-2 right-2 sm:p-3 p-2 bg-dark-light rounded-full hover:bg-primary cursor-pointer" title="Add to Cart">
                        <ShoppingBag className="text-primary group-hover/group2:text-white " />
                    </span>
                </div>
                <div className="info ">
                    <div className="name">
                        <h2 className="text-lg font-semibold pt-1">Trial Product</h2>
                        <div className="flex flex-row gap-2 items-center">
                            <Rating name="read-only" defaultValue={3} readOnly size={isMobile ? 'small' : 'medium'} />
                            <p className="text-gray-400">3</p>
                        </div>
                        <p className="py-1 max-sm:hidden ">Lorem, ipsum dolor sit amet consectetur .</p>
                        <div>
                            <strong className="text-lg font-bold py-1">40.9$</strong>
                        </div>
                        <div className="flex-row justify-between gap-2 items-center py-2 hidden group-hover/group3:flex transition-all">
                            <button className="p-2 border border-primary rounded-lg  shadow-md hover:shadow-sm text-primary shadow-primary-dark-light">See Preview</button>
                            <span className="cursor-pointer" onClick={() => setIsFavourite((prev) => !prev)} title="Add to Favorites">
                                {isFavourite ? <Heart fill="currentColor" /> : <Heart />}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
