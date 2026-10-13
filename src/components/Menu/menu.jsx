import React from 'react';
import images from '../../constants/images';
export default function Menu({
  items
}) {
  return <div className="menu-grid">{items.map(({
      id,
      title,
      img,
      desc,
      price,
      pdf
    }) => <article key={`${id}-${title}`} className="menu-item">
      {img && <img src={img} alt={title} className="dish-photo" loading="lazy" />}
      {pdf && <a href={pdf} className="pdf-preview">
        <img src={images.menu_screen} alt="View sushi and sashimi menu PDF" loading="lazy" />
      </a>}
      <div className="item-info">
        <header>
          <h3>{title}</h3>
          {!pdf && <span className="price">${price}</span>}
        </header>
        <p>{desc}</p>
        {pdf && <a className="text-link" href={pdf}>Open menu PDF ↗</a>}
      </div>
    </article>)}</div>;
}
