import React from 'react';
import { Link } from 'react-router-dom';
import { data, images } from '../../constants';
export default function SpecialMenu() {
  return <section className="section featured" id="menu">
    <div className="section-heading">
      <p className="eyebrow">03 / SIGNATURE SELECTIONS</p>
      <h2>Made to be savored.</h2>
      <p>Explore a few of the dishes on our menu.</p>
    </div>
    <figure className="selection-photo">
      <img src={images.assortment} alt="Take Sushi sushi and nigiri platter" loading="lazy" />
      <figcaption>THE SUSHI BAR / TAKE SUSHI</figcaption>
    </figure>
    <div className="featured-columns">{[['From the sushi bar', data.specialRolls], ['From the kitchen', data.specials]].map(([title, dishes]) => <div key={title}>
        <h3>{title}</h3>
        {dishes.map(dish => <article className="featured-item" key={dish.id}>
          <div>
            <h4>{dish.title}</h4>
            <span>${dish.price}</span>
          </div>
          <p>{dish.description}</p>
        </article>)}
      </div>)}</div>
    <Link className="button button-outline" to="/fullmenu">Explore the full menu ↗</Link>
  </section>;
}
