import React from 'react';
import { Chef, Gallery, Header, SpecialMenu } from '../../container';
import { Link } from 'react-router-dom';
import { FiArrowUpRight } from 'react-icons/fi';
import { Hours } from '../../container/Footer/Footer';
import { items, images } from '../../constants';
import { ORDER_URL } from '../../constants/restaurant';
export default function Home() {
  return <><Header /><Chef />
  <section className="section catering-promo" aria-labelledby="catering-promo-heading">
    <img src={images.assortment2} alt="Take Sushi sushi platter for a gathering" loading="lazy" width="900" height="675" />
    <div><p className="eyebrow">CATERING / TAKE SUSHI</p><h2 id="catering-promo-heading">YOUR EVENT.<br /><em>OUR CRAFT.</em></h2><p>Fresh sushi, thoughtfully prepared for every occasion.</p><Link className="button" to="/catering">Explore catering <FiArrowUpRight aria-hidden="true" /></Link></div>
  </section><SpecialMenu />
  <section className="section menu-preview">
    <div>
      <p className="eyebrow">04 / THE MENU</p>
      <h2>Find your flavor.</h2>
      <p>From the sushi bar to the Japanese kitchen.</p>
    </div>
    <nav aria-label="Explore menu categories">
      {[...new Set(items.map(item => item.category))].map((category, index) => <Link key={category} to={`/fullmenu?category=${encodeURIComponent(category)}`}>
        <span className="editorial-number">0{index + 1}</span>
        <span>{category}</span>
        <FiArrowUpRight aria-hidden="true" />
      </Link>)}
    </nav>
  </section>
  <Gallery /><section className="order-section">
    <p className="eyebrow">TAKE SUSHI, TAKE HOME</p>
    <h2>Your table.<br /><em>Our Japanese cuisine.</em></h2>
    <p>Browse the menu and order your next meal online.</p>
    <a className="button" href={ORDER_URL}>Order online ↗</a>
  </section><section className="visit-preview section">
    <div>
      <p className="eyebrow">06 / VISIT TAKE SUSHI</p>
      <h2>A place at<br /><em>our table.</em></h2>
      <address>1366 Walton Blvd<br />Rochester Hills, MI 48309</address>
      <p>Located in the Rochester Hills Plaza</p>
      <Link className="text-link" to="/contact">Location &amp; directions <FiArrowUpRight aria-hidden="true" /></Link>
    </div>
    <div className="visit-details">
      <h3>Opening hours</h3>
      <Hours />
      <h3>Reach us</h3>
      <a href="tel:+12486527800">+1 (248) 652-7800</a>
      <br />
      <a href="tel:+12486524601">+1 (248) 652-4601</a>
    </div>
  </section></>;
}
