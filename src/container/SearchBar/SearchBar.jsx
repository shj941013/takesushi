import React, { useState } from "react";
import { Menu } from "../../components";
import "./SearchBar.css";

const getFilteredItems = (query, items) => {
    const filteredItems = {}
    if (!query) {
        return items;
    }

    Object.entries(items).map(item => {
        const set = new Set();
        Array.from(item[1]).map((food) => {
            const { title } = food;

            if(title.toLowerCase().includes(query.toLowerCase())) {
                set.add(food);
            }
        })
        if (set.size !== 0) {
            filteredItems[item[0]] = set;
        }
    })

    return filteredItems;
}

function SearchBar({placeholder, items }) {
    const [query, setQuery] = useState("");
    const filteredItems = getFilteredItems(query, items);

    return (
        <div>
            <div className="search">
                {/* <div className="searchInputs"> */}
                    <input 
                        type="text"
                        placeholder={placeholder} 
                        onChange={(e) => setQuery(e.target.value)} />
                {/* </div> */}
            </div>
            <div>
            { 
            Object.entries(filteredItems).map(([key, value]) =>
                <div key={key}>
                    <p className='subCategory'> { key } </p>
                        { <Menu items={ Array.from(value) } /> }
                    <br />
                </div>
            )}
            </div>
        </div>
    )
}

export default SearchBar;