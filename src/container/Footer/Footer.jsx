import React from 'react';
import Brand from '../../components/Brand';
import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook } from 'react-icons/fi';
import { hours, INSTAGRAM_URL, FACEBOOK_URL, ORDER_URL } from '../../constants/restaurant';
export function Hours() {
  return <dl className="hours">{hours.map(([day, time]) => <div key={day}>
      <dt>{day}</dt>
      <dd>{time}</dd>
    </div>)}</dl>;
}
export default function Footer() {
  return <footer className="site-footer">
    <div className="footer-grid">
      <div>
        <Brand footer />
        <p>Japanese cuisine.<br />Rochester Hills, Michigan.</p>
        <div className="socials">
          <a aria-label="Take Sushi on Instagram" href={INSTAGRAM_URL}>
            <FiInstagram />
          </a>
          <a aria-label="Take Sushi on Facebook" href={FACEBOOK_URL}>
            <FiFacebook />
          </a>
        </div>
      </div>
      <div>
        <h3>Visit us</h3>
        <address>1366 Walton Blvd<br />Rochester Hills, MI 48309<br /><span>Rochester Hills Plaza</span></address>
        <a href="tel:+12486527800">+1 (248) 652-7800</a>
        <br />
        <a href="tel:+12486524601">+1 (248) 652-4601</a>
      </div>
      <div>
        <h3>Opening hours</h3>
        <Hours />
      </div>
      <nav aria-label="Footer navigation">
        <h3>Explore</h3>
        <Link to="/">Home</Link>
        <Link to="/about">Our story</Link>
        <Link to="/fullmenu">Menu</Link>
        <Link to="/catering">Catering</Link>
        <Link to="/contact">Contact</Link>
        <a href={ORDER_URL}>Order online ↗</a>
      </nav>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} Take Sushi. All rights reserved.</span>
      <span>THE ART OF JAPANESE CUISINE</span>
    </div>
  </footer>;
}
