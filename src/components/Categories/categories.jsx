import React from 'react';
export default function Categories({
  categories,
  filterItems,
  activeCategory
}) {
  return <div className="category-list" aria-label="Menu categories">{categories.map(category => <button type="button" key={category} className={activeCategory === category ? 'filter-btn selected' : 'filter-btn'} aria-pressed={activeCategory === category} onClick={() => filterItems(category)}>{category === 'all' ? 'All dishes' : category}</button>)}</div>;
}
