import React from 'react';

import { SubHeading, SpecialMenuItem } from '../../components';
import { data, images } from '../../constants';
import './SpecialMenu.css';

const SpecialMenu = () => (
  <div className="app__specialMenu flex__center section__padding" id="menu">
    <div className="app__specialMenu-title">
      <SubHeading title="Menu that fits your palatte" />
      <h1 className="headtext__cormorant">Today&apos;s Special</h1>
    </div>

    <div className="app__specialMenu-menu">
      <div className="app__specialMenu-menu_wine  flex__center">
        <p className="app__specialMenu-menu_heading">Special Rolls</p>
        <div className="app__specialMenu_menu_items">
          {data.specialRolls.map((specialRoll, index) => (
            <SpecialMenuItem key={specialRoll.title + index} title={specialRoll.title} price={specialRoll.price} tags={specialRoll.description} />
          ))}
        </div>
      </div>

      <div className="app__specialMenu-menu_img">
        <img src={images.menu} alt="menu__img" />
      </div>

      <div className="app__specialMenu-menu_cocktails  flex__center">
        <p className="app__specialMenu-menu_heading">Our Most Popular</p>
        <div className="app__specialMenu_menu_items">
          {data.specials.map((specials, index) => (
            <SpecialMenuItem key={specials.title + index} title={specials.title} price={specials.price} tags={specials.description} />
          ))}
        </div>
      </div>
    </div>

    <div style={{ marginTop: 15 }}>
      <button type="button" className="custom__button">View More</button>
    </div>
  </div>
);

export default SpecialMenu;