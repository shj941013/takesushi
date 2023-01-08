import React from 'react';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

import { FooterOverlay, Newsletter } from '../../components';
import { images } from '../../constants';
import './Footer.css';

const Footer = () => (
  <div className="app__footer section__padding" id="login">
    <div className="app__footer-links">
      <div className="app__footer-links_contact">
        <h1 className="app__footer-headtext">Contact Us</h1>
        <p className="p__opensans">1366 Walton Blvd, Rochester Hills, MI 48309</p>
        <p className="p__opensans">+1 (248) 652-7800</p>
        <p className="p__opensans">+1 (248) 652-4601</p>
        <p className="p__opensans">Located in the Rochester Hills Plaza</p>
      </div>

      <div className="app__footer-links_logo">
        <img src={images.takeSushiLogo} alt="footer_logo" />
        <p className="p__opensans">&quot;The best way to find yourself is to lose yourself in the service of others.&quot;</p>
        <img src={images.spoon} className="spoon__img" style={{ marginTop: 15 }} />
        <div className="app__footer-links_icons">
        <a href='https://www.facebook.com/profile.php?id=100067170430552'><FiFacebook /></a>
          {/* <FiTwitter /> */}
          <a href='https://www.instagram.com/takesushi_mi/'><FiInstagram /></a>
        </div>
      </div>

      <div className="app__footer-links_work">
        <h1 className="app__footer-headtext">Working Hours</h1>
        <p className="p__opensans">Monday:</p>
        <p className="p__opensans">Closed</p>        
        <p className="p__opensans">Tuesday - Friday:</p>
        <p className="p__opensans">11:00 A.M. - 8:30 P.M.</p>
        <p className="p__opensans">Saturday</p>
        <p className="p__opensans">12:00 P.M. - 8:30 P.M.</p>
        <p className="p__opensans">Sunday</p>
        <p className="p__opensans">4:00 P.M - 8:30 P.M.</p>
      </div>
    </div>

    <div className="footer__copyright">
      <p className="p__opensans">2023 Take Sushi. All Rights reserved.</p>
    </div>

  </div>
);

export default Footer;