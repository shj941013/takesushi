import React from 'react';
import { GiHamburgerMenu } from 'react-icons/gi';
import { MdOutlineRestaurantMenu } from 'react-icons/md';
import images from '../../constants/images';
import './Navbar.css';

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = React.useState(false);
  return (
    <nav className="app__navbar">
      <div className="app__navbar-logo">
      <a href="/"><img src={images.takeSushiLogo} alt="app__logo" /></a>
      </div>
      <ul className="app__navbar-links">
        <li className="p__opensans"><a href="/">Home</a></li>
        <li className="p__opensans"><a href="about">About</a></li>
        <li className="p__opensans"><a href="fullmenu">Menu</a></li>
        <li className="p__opensans"><a href="contact">Contact</a></li>
      </ul>
      {/* <div className="app__navbar-login">
        <a href="#login" className="p__opensans">Log In / Registration</a>
        <div />
        <a href="/" className="p__opensans">Book Table</a>
      </div> */}
      <div className="app__navbar-login">
        <a href="https://www.epipay.com/take/en/WebOrder?STORE_CODE=MTAwMA==&table_num=MTAwMA==" className="p__opensans">Order Now</a>
      </div>
      <div className="app__navbar-smallscreen">
        <GiHamburgerMenu color="#fff" fontSize={27} onClick={() => setToggleMenu(true)} />
        {toggleMenu && (
          <div className="app__navbar-smallscreen_overlay flex__center slide-bottom">
            <MdOutlineRestaurantMenu fontSize={27} className="overlay__close" onClick={() => setToggleMenu(false)} />
            <ul className="app__navbar-smallscreen_links">
              <li><a href="/" onClick={() => setToggleMenu(false)}>Home</a></li>
              <li><a href="about" onClick={() => setToggleMenu(false)}>About</a></li>
              <li><a href="fullmenu" onClick={() => setToggleMenu(false)}>Menu</a></li>
              <li><a href="contact" onClick={() => setToggleMenu(false)}>Contact</a></li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;