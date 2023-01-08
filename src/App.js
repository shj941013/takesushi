import React from 'react';

import { AboutUs, FindUs, Footer, FullMenu } from './container';
import { Navbar, Home } from './components';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div>
      <Navbar />
        <Routes>
          <Route path="/" element={ <Home /> } />
          <Route path="/fullMenu" element={ <FullMenu /> } />
          <Route path="/about" element={ <AboutUs /> } />
          <Route path="/contact" element={ <FindUs /> } />
        </Routes>
      <Footer />
      </div>
    </Router>
)};

export default App;
