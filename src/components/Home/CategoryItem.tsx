import React, { useState } from 'react';
import { useStore } from '../../store/zustandStore';

type propsType = {
    title: string;
    id: string;
};

const CategoryItem = (props: propsType) => {
    const selectedCategory = useStore((store) => store.selectedCategory);
    const setSelectedCategory = useStore((store) => store.setSelectedCategory);
    return (
        <div
            className={`flex rounded-xl items-center justify-center py-2 cursor-pointer ${selectedCategory === props.id ? 'bg-primary text-white' : 'bg-primary-dark-light'} min-w-fit px-10`}
            onClick={() => setSelectedCategory(props.id)}
        >
            <p className="text-lg font-bold text-center">{props.title}</p>
        </div>
    );
};

export default CategoryItem;
