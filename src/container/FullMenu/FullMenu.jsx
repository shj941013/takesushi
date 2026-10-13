import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { items, images } from '../../constants';
import { Categories } from '../../components';
import SearchBar from '../SearchBar/SearchBar';
import { ORDER_URL } from '../../constants/restaurant';
const categories = ['all', ...new Set(items.map(item => item.category))];
export default function FullMenu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedCategory = searchParams.get('category');
  const activeCategory = categories.includes(requestedCategory) ? requestedCategory : 'all';
  const setCategory = category => {
    const next = new URLSearchParams(searchParams);
    if (category === 'all') next.delete('category');else next.set('category', category);
    setSearchParams(next, {
      replace: true
    });
  };
  const selected = activeCategory === 'all' ? items : items.filter(item => item.category === activeCategory);
  const groups = selected.reduce((acc, item) => {
    (acc[item.subCategory] ||= []).push(item);
    return acc;
  }, {});
  return <section className="menu-page section">
    <div className="menu-heading">
      <p className="eyebrow">FROM OUR KITCHEN &amp; SUSHI BAR</p>
      <h1>Something to savor.</h1>
      <p>Explore our Japanese cuisine, one dish at a time.</p>
      <div className="actions">
        <a className="button" href={ORDER_URL}>Order online ↗</a>
        <a className="text-link" href={images.sushi_menu}>Sushi &amp; sashimi PDF ↗</a>
      </div>
    </div>
    <Categories categories={categories} activeCategory={activeCategory} filterItems={setCategory} />
    <SearchBar placeholder="Search dishes in this category..." items={groups} />
    <aside className="menu-notice">
      <p>Consuming raw or undercooked meats, poultry, seafood, shellfish or eggs may increase your risk of food borne illness.</p>
      <p>** Dish served raw</p>
    </aside>
  </section>;
}
