import React, { useState } from 'react';

import { data, images } from '../../constants';

//TODO: fake data replace.
import { items } from '../../constants'

import { Categories, Menu } from '../../components';
import './FullMenu.css';

const allCategories = ["all", ...new Set(items.map((item) => item.category))];

const FullMenu = () => {
    const [menuItems, setMenuItems] = useState(items);
    const [activeCategory, setActiveCategory] = useState("");
    const [categories, setCategories] = useState(allCategories);

    const filterItems = (category) => {
        setActiveCategory(category);

        if (category === "all") {
            setMenuItems(items)
            return;
        }
        const newItems = items.filter((item) => item.category === category);
        setMenuItems(newItems);
    };

    const subCategories = [...new Set(menuItems.map((obj) => obj.subCategory))];

    var dict = {}

    subCategories.forEach((subCategory) => {
        var set = new Set();
        const subCategoryItems = menuItems.forEach((item) => {
            if (item.subCategory === subCategory) {
                set.add(item);
            }

            set.forEach(e => console.log(e))
        });
    

        return dict[subCategory] = subCategoryItems;
    });

    console.log("dict: " + JSON.stringify(dict));

    return (
    <section className='menu app__bg'>
        <div className='title'>
            <img src={images.takeSushiLogo} alt="logo" className="logo" />
            <h2> Menu List </h2>
            <div className='underline'></div>
        </div>
        <Categories
            categories={categories} 
            activeCategory={activeCategory} 
            filterItems={filterItems} 
        />
        <Menu items={menuItems} />
    </section>
    );
};

export default FullMenu;