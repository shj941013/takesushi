import React, { useEffect } from 'react';
import { AboutUs, FindUs, Footer, FullMenu } from './container';
import { Navbar, Home } from './components';
import './App.css';
import Catering from './container/Catering/Catering';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
const RouteEffects = () => {
  const {
    pathname
  } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    const names = {
      '/': 'Japanese Restaurant in Rochester Hills',
      '/about': 'Our Story',
      '/fullmenu': 'Menu',
      '/contact': 'Visit Us',
      '/catering': 'Sushi Catering in Rochester Hills'
    };
    document.title = `Take Sushi | ${names[pathname.toLowerCase()] || 'Japanese Restaurant'}`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = pathname.toLowerCase() === '/catering'
      ? 'Plan sushi catering in Rochester Hills with Take Sushi. Explore Japanese catering ideas, sushi platters, and corporate event inquiries. Request a catering quote online or call the restaurant.'
      : 'Explore Take Sushi in Rochester Hills, Michigan. Browse our Japanese menu, order online, and find our location and opening hours.';
  }, [pathname]);
  return null;
};
const App = () => {
  return <Router>
      <div>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <RouteEffects />
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fullMenu" element={<FullMenu />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/catering" element={<Catering />} />
          <Route path="/contact" element={<FindUs />} />
        </Routes>
      </main>
      <Footer />
      </div>
    </Router>;
};
export default App;
