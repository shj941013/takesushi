import React, { useState } from 'react';
import { FiArrowLeft, FiArrowRight, FiArrowUpRight, FiInstagram } from 'react-icons/fi';
import { images } from '../../constants';
import { INSTAGRAM_URL } from '../../constants/restaurant';

const photos = [
  [images.assortment, 'Sushi and nigiri assortment'],
  [images.massRainbowRoll, 'Rainbow rolls'],
  [images.massSpicyCalifornia, 'Spicy crab rolls'],
  [images.assortment2, 'Sushi and sashimi platter'],
];

export default function Gallery() {
  const [selected, setSelected] = useState(0);
  const [src, title] = photos[selected];
  const select = index => setSelected(Math.max(0, Math.min(photos.length - 1, index)));
  const navigate = event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const destinations = { ArrowLeft: selected - 1, ArrowRight: selected + 1, Home: 0, End: photos.length - 1 };
    if (event.key in destinations) {
      event.preventDefault();
      select(destinations[event.key]);
    }
  };

  return (
    <section className="gallery-section" aria-labelledby="gallery-title" onKeyDown={navigate}>
      <div className="section gallery-layout">
        <div className="gallery-feature">
          <figure>
            <a href={INSTAGRAM_URL} aria-label={`View ${title} on Instagram`}>
              <img src={src} alt={title} loading="lazy" width="1200" height="900" />
            </a>
            <figcaption id="gallery-caption" aria-live="polite">{title}</figcaption>
          </figure>
          <div className="gallery-editorial">
            <p className="eyebrow">05 / A VISUAL STORY</p>
            <h2 id="gallery-title">Every color.<br /><em>Every cut.</em></h2>
            <p>A closer look at Take Sushi. Explore the rolls, nigiri, and sashimi from our sushi bar.</p>
            <a className="gallery-social" href={INSTAGRAM_URL}><FiInstagram aria-hidden="true" /> Follow along <FiArrowUpRight aria-hidden="true" /></a>
            <div className="gallery-paging">
              <span className="gallery-count" role="status">{selected + 1} / {photos.length}</span>
              <div className="gallery-controls">
                <button type="button" aria-label="Previous gallery photos" disabled={selected === 0} onClick={() => select(selected - 1)}><FiArrowLeft aria-hidden="true" /></button>
                <button type="button" aria-label="Next gallery photos" disabled={selected === photos.length - 1} onClick={() => select(selected + 1)}><FiArrowRight aria-hidden="true" /></button>
              </div>
            </div>
          </div>
        </div>
        <div className="gallery-grid" role="group" aria-label="Choose a gallery photo. Use arrow keys, Home, or End to browse.">
          {photos.map(([photo, caption], index) => (
            <figure className="gallery-thumbnail" key={photo}>
              <button type="button" className={selected === index ? 'is-selected' : ''} aria-label={`Show ${caption}`} aria-pressed={selected === index} onClick={() => select(index)}>
                <img src={photo} alt="" loading="lazy" width="600" height="450" />
              </button>
              <figcaption><a href={INSTAGRAM_URL}>{caption} <FiArrowUpRight aria-hidden="true" /></a></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
