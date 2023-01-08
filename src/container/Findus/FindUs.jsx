import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';

const FindUs = () => (
  <div className="app__bg app__wrapper section__padding" id="contact">
    <div className="app__wrapper_info">
      <SubHeading title="Contact" />
      <h1 className="headtext__cormorant" style={{ marginBottom: '3rem 0 1rem 0' }}>Find Us</h1>
      <div className="app__wrapper-content">
      <p className="p__cormorant" style={{ color: '#DCCA87', margin: '2rem 0 0 0' }}>Our Location</p>
        <p className="p__opensans">1366 Walton Blvd, Rochester Hills, MI 48309</p>
        <p className="p__cormorant" style={{ color: '#DCCA87', margin: '2rem 0 0 0' }}>Reach Us At</p>
        <p className="p__opensans"> +1 (248) 652-7800 </p>
        <p className="p__opensans"> +1 (248) 652-4601 </p>
        <p className="p__cormorant" style={{ color: '#DCCA87', margin: '2rem 0 0 0' }}>Opening Hours</p>
        <p className="p__opensans">Monday: Closed</p>
        <p className="p__opensans">Tue - Fri: 11:00 A.M. - 08:30 P.M.</p>
        <p className="p__opensans">Saturday: 12:00 P.M. - 08:30 P.M.</p>
        <p className="p__opensans">Sunday: 04:00 P.M. - 08:30 P.M.</p>
      </div>
      {/* <button type="button" className="custom__button" style={{ marginTop: '2rem' }}>Visit Us</button> */}
    </div>

    <div className="app__wrapper_img">
      <img src={images.findus} alt="finus_img" />
    </div>
  </div>
);

export default FindUs;