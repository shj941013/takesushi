import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowUpRight, FiArrowDown } from 'react-icons/fi';
import { images } from '../../constants';
import { ORDER_URL } from '../../constants/restaurant';
export default function Header() {
  return <section className="hero" id="home">
    <div className="hero-content">
      <p className="eyebrow">TAKE SUSHI &mdash; ROCHESTER HILLS</p>
      <h1>
        <span>A Taste of Japan.</span>
        <em>Right Here at Home.</em>
      </h1>
      <div className="hero-description">
        <p>Authentic Japanese favorites, prepared with care.</p>
      </div>
      <div className="actions">
        <a className="button" href={ORDER_URL}>ORDER ONLINE <FiArrowUpRight /></a>
        <Link className="text-link" to="/fullmenu">EXPLORE THE MENU <FiArrowRight /></Link>
      </div>
    </div>
    <figure className="hero-art">
      <img className="hero-image" src={images.assortment2} alt="Take Sushi's assortment of sushi and sashimi" fetchpriority="high" />
      <figcaption>
        <span>FROM THE TAKE SUSHI BAR</span>
        <span>EST. 1995</span>
      </figcaption>
    </figure>
    <footer className="hero-bottom">
      <span>JAPANESE CUISINE / ROCHESTER HILLS, MI</span>
      <a href="#welcome">SCROLL TO DISCOVER <FiArrowDown /></a>
    </footer>
  </section>;
}
