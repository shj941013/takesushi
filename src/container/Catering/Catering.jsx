import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowUpRight, FiArrowDown, FiPhone } from 'react-icons/fi';
import { images, data } from '../../constants';
import { cateringEvents, cateringSelections } from '../../constants/catering';
import CateringForm from './CateringForm';
import './Catering.css';
const descriptions = ['Start with familiar rolls. Explore the existing sushi menu and tell us which selections you have in mind.', `Explore our specialty rolls, including ${data.specialRolls.map(item => item.title.replace('**', '')).join(', ')}.`, 'Discover the sushi and sashimi selections on our existing menu, and discuss an assortment for your gathering.', 'Tell us your vegetarian preferences and dietary needs so the restaurant can discuss suitable choices.', 'Share your favorite selections and event details. Ask us about a platter tailored to your gathering.'];
export default function Catering() {
  return <div className="catering-page">
    <section className="section catering-hero" aria-labelledby="catering-heading">
      <div>
        <p className="eyebrow">TAKE SUSHI / CATERING / ROCHESTER HILLS</p>
        <h1 id="catering-heading">MAKE EVERY<br /><em>GATHERING</em><br />EXTRAORDINARY.</h1>
        <p>From corporate lunches to unforgettable celebrations, bring the flavors of Take Sushi to your next event.</p>
        <div className="actions">
          <a className="button" href="#catering-inquiry">Request a catering quote <FiArrowUpRight aria-hidden="true" /></a>
          <a className="text-link" href="#catering-options">Explore catering options <FiArrowDown aria-hidden="true" /></a>
        </div>
      </div>
      <figure>
        <img src={images.assortment2} alt="Take Sushi platter with nigiri, sashimi, and rolls" width="1000" height="1000" fetchpriority="high" />
        <figcaption>FROM OUR SUSHI BAR. FOR YOUR GATHERING.</figcaption>
      </figure>
    </section>
    <section className="section catering-options" id="catering-options" aria-labelledby="options-heading">
      <div className="catering-section-intro">
        <p className="eyebrow">01 / CATERING SELECTIONS</p>
        <h2 id="options-heading">A spread worth<br /><em>coming together for.</em></h2>
        <p>Explore ideas for Japanese catering in Rochester Hills. Tell us what you love; we will discuss availability and a quote.</p>
        <Link className="text-link" to="/fullmenu">Browse our existing menu <FiArrowUpRight aria-hidden="true" /></Link>
        <img src={images.massRainbowRoll} alt="Take Sushi rolls arranged on a platter" loading="lazy" width="900" height="675" />
      </div>
      <div className="catering-selection-list">{cateringSelections.map((selection, index) => <article key={selection}>
          <span className="editorial-number">0{index + 1}</span>
          <div>
            <h3>{selection}</h3>
            <p>{descriptions[index]}</p>
          </div>
        </article>)}</div>
    </section>
    <section className="catering-events">
      <div className="section">
        <div>
          <p className="eyebrow">02 / THE OCCASION</p>
          <h2>A gathering.<br /><em>A reason to celebrate.</em></h2>
          <p>Planning sushi catering for a corporate lunch or a private celebration? Share your plans with Take Sushi.</p>
        </div>
        <ul>{cateringEvents.map(event => <li key={event}>{event}</li>)}</ul>
      </div>
    </section>
    <section className="section catering-photography" aria-labelledby="platter-heading">
      <div className="catering-photo-heading">
        <div>
          <p className="eyebrow">03 / FROM TAKE SUSHI</p>
          <h2 id="platter-heading">The art of sharing.</h2>
        </div>
        <p>A closer look at our sushi platters in Michigan. Photography shows restaurant dishes, not fixed catering packages.</p>
      </div>
      <div className="catering-photo-grid">{[[images.assortment, 'Take Sushi nigiri and roll assortment'], [images.assortment2, 'Sushi and sashimi platter from Take Sushi']].map(([src, alt]) => <figure key={src}>
          <img src={src} alt={alt} loading="lazy" width="900" height="675" />
        </figure>)}</div>
    </section>
    <section className="section catering-inquiry" id="catering-inquiry" aria-labelledby="inquiry-heading">
      <div>
        <p className="eyebrow">04 / LET'S PLAN YOUR EVENT</p>
        <h2 id="inquiry-heading">Your gathering.<br /><em>Our conversation.</em></h2>
        <p>Tell us about your event to request a catering quote. We will discuss the details before anything is confirmed.</p>
        <a className="catering-call" href="tel:+12486527800">
          <FiPhone aria-hidden="true" />
          <span>Prefer to call?<strong>(248) 652-7800</strong></span>
        </a>
        <p className="catering-small">1366 Walton Blvd<br />Rochester Hills, MI 48309</p>
      </div>
      <CateringForm />
    </section>
  </div>;
}
