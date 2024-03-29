import React from 'react';

import { SubHeading } from '../../components';
import { images } from '../../constants';
import './Header.css';

const Header = () => (
  <div className="app__header app__wrapper section__padding" id="home">
    <div className="app__wrapper_info">
      <SubHeading title="Taste of Japan" />
      <h1 className="app__header-h1">The Art of Japanese Cuisine</h1>
      <p className="p__opensans" style={{ margin: '2rem 0', fontFamily: 'cursive', fontSize: '20px' }}>Enjoy the experience</p>
      <div>
        <button type="button" className="custom__button"><a href="https://www.epipay.com/take/en/WebOrder?STORE_CODE=MTAwMA==&table_num=MTAwMA==">Order Now</a></button>
      </div>
    </div>

    <div className="app__wrapper_img">
      <img src={images.header} alt="header_img" />
    </div>
  </div>
);

export default Header;