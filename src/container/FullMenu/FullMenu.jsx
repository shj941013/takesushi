import React, { useState } from 'react';

import { data, images } from '../../constants';

//TODO: fake data replace.
import { items } from '../../constants'

import { Categories, Menu } from '../../components';
import './FullMenu.css';
import SearchBar from '../SearchBar/SearchBar';

const allCategories = ["all", ...new Set(items.map((item) => item.category))];

const FullMenu = () => {
    const [menuItems, setMenuItems] = useState(items);
    const [activeCategory, setActiveCategory] = useState("");
    const [categories, setCategories] = useState(allCategories);

    const filterItems = (category) => {
        setActiveCategory(category);

        if (category === "all") {
            setMenuItems(items);
            return;
        }

        const newItems = items.filter((item) => item.category === category);
        setMenuItems(newItems);
    };

    const subCategories = [...new Set(menuItems.map((obj) => obj.subCategory))];

    const subCategorizedItems = {}

    subCategories.forEach((subCategory) => {
        const set = new Set();

        menuItems.forEach((item) => {
            if (item.subCategory === subCategory) {
                set.add(item);
            }
        });

        subCategorizedItems[subCategory] = set;
    });

    return (
    <section className='menu app__bg'>
        <div className='title'>
            <img src={images.takeSushiLogo} alt="logo" className="logo" />
            <h2> Menu List </h2>
            <div className='underline'></div>
        </div>
        <div className='center'>
            <Categories
                categories={categories} 
                activeCategory={activeCategory} 
                filterItems={filterItems} 
            />
            <p>Consuming raw or undercooked meats, poultry, seafood, shellfish or eggs may increase your risk of food borne illness</p>
            <p>** Dish served raw</p>
        </div>

        <SearchBar placeholder="🔎🍱 SEARCH" items={subCategorizedItems} />
    </section>
    );
};

export default FullMenu;