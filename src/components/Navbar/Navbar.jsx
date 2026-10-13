import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiArrowUpRight } from 'react-icons/fi';
import { ORDER_URL } from '../../constants/restaurant';
import Brand from '../Brand';
const links = [['/', 'Home'], ['/about', 'Our story'], ['/fullmenu', 'Menu'], ['/catering', 'Catering'], ['/contact', 'Visit us']];
export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const toggle = useRef(null);
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);
  useEffect(() => {
    const close = e => {
      if (open && e.key === 'Escape') {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    document.addEventListener('keydown', close);
    return () => document.removeEventListener('keydown', close);
  }, [open]);
  return <header className="site-header">
    <div className="nav-inner">
      <Brand />
      <nav className="desktop-nav" aria-label="Main navigation">{links.map(([to, name]) => <NavLink key={to} to={to} end={to === '/'}>{name}</NavLink>)}</nav>
      <a className="button nav-order" href={ORDER_URL}>Order online <FiArrowUpRight /></a>
      <button ref={toggle} className="nav-toggle" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen(!open)}>{open ? <FiX /> : <FiMenu />}</button>
    </div>
    {open && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
      {links.map(([to, name]) => <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{name}</NavLink>)}
      <a href={ORDER_URL}>Order online ↗</a>
    </nav>}
  </header>;
}
