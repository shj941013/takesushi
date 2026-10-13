import React, { useState } from 'react';
import { Menu } from '../../components';
export default function SearchBar({
  placeholder,
  items
}) {
  const [query, setQuery] = useState('');
  const groups = Object.entries(items).map(([name, foods]) => [name, Array.from(foods).filter(food => food.title.toLowerCase().includes(query.toLowerCase()))]).filter(([, foods]) => foods.length);
  return <div>
    <div className="menu-search">
      <label htmlFor="dish-search">Find a dish</label>
      <div>
        <input id="dish-search" type="search" value={query} placeholder={placeholder} onChange={e => setQuery(e.target.value)} />
        {query && <button onClick={() => setQuery('')} aria-label="Clear dish search">Clear</button>}
      </div>
    </div>
    <p className="search-status" role="status">{groups.reduce((count, [, foods]) => count + foods.length, 0)} dishes{query && ` matching "${query}"`}</p>
    {groups.length ? groups.map(([name, foods]) => <section className="menu-group" key={name}>
      <h2>{name}</h2>
      <Menu items={foods} />
    </section>) : <div className="empty-state">
      <h2>No dishes found.</h2>
      <p>Try another name, clear your search, or choose a different category.</p>
    </div>}
  </div>;
}
