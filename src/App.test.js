import React from 'react';
import { render, screen, within, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';
import { items } from './constants';
import { ORDER_URL } from './constants/restaurant';
beforeEach(() => {
  window.scrollTo = jest.fn();
});
function openRoute(path) {
  window.history.replaceState({}, '', path);
  return render(<App />);
}
test.each([['/', /A Taste of Japan/], ['/about', /Food brings us together/], ['/contact', /Make yourself at home/], ['/catering', /MAKE EVERY/], ['/fullMenu', /Something to savor/], ['/fullmenu', /Something to savor/]])('existing route %s renders and preserves ordering', (path, heading) => {
  openRoute(path);
  expect(screen.getByRole('heading', {
    level: 1,
    name: heading
  })).toBeInTheDocument();
  screen.getAllByRole('link', {
    name: /Order online/i
  }).forEach(link => expect(link).toHaveAttribute('href', ORDER_URL));
});
test('all menu data survives, category and search work together, and clearing restores results', () => {
  openRoute('/fullmenu');
  const main = screen.getByRole('main');
  const renderedDishes = Array.from(main.querySelectorAll('.menu-item'));
  items.forEach(item => {
    const dish = renderedDishes.find(node => node.querySelector('h3').textContent === item.title && node.querySelector('p').textContent === item.desc);
    expect(dish).toBeDefined();
    expect(within(dish).getByText(item.desc)).toBeInTheDocument();
    if (!item.pdf) expect(within(dish).getByText(`$${item.price}`)).toBeInTheDocument();
  });
  expect(main.querySelectorAll('.menu-item')).toHaveLength(items.length);
  expect(main.querySelector('a.pdf-preview')).toHaveAttribute('href', items.find(item => item.pdf).pdf);
  fireEvent.click(screen.getByRole('button', {
    name: 'appetizers'
  }));
  expect(screen.getByRole('button', {
    name: 'appetizers'
  })).toHaveAttribute('aria-pressed', 'true');
  const search = screen.getByRole('searchbox', {
    name: 'Find a dish'
  });
  fireEvent.change(search, {
    target: {
      value: 'gYoZa'
    }
  });
  expect(main.querySelectorAll('.menu-item')).toHaveLength(1);
  expect(screen.getByRole('heading', {
    name: 'Gyoza'
  })).toBeInTheDocument();
  fireEvent.change(search, {
    target: {
      value: 'no such food'
    }
  });
  expect(screen.getByText('No dishes found.')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', {
    name: 'Clear dish search'
  }));
  expect(main.querySelectorAll('.menu-item')).toHaveLength(items.filter(item => item.category === 'appetizers').length);
});
test('mobile navigation opens, closes with Escape, and closes on route selection', () => {
  openRoute('/');
  const toggle = screen.getByRole('button', {
    name: 'Open navigation'
  });
  fireEvent.click(toggle);
  expect(toggle).toHaveAttribute('aria-expanded', 'true');
  fireEvent.keyDown(document, {
    key: 'Escape'
  });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
  fireEvent.click(toggle);
  fireEvent.click(within(screen.getByRole('navigation', {
    name: 'Mobile navigation'
  })).getByRole('link', {
    name: 'Menu'
  }));
  expect(screen.queryByRole('navigation', {
    name: 'Mobile navigation'
  })).not.toBeInTheDocument();
  expect(screen.getByRole('heading', {
    name: 'Something to savor.'
  })).toBeInTheDocument();
});
test('contact keeps both telephone numbers, all hours, and map integration', () => {
  openRoute('/contact');
  expect(screen.getAllByRole('link', {
    name: '+1 (248) 652-7800'
  })[0]).toHaveAttribute('href', 'tel:+12486527800');
  expect(screen.getAllByRole('link', {
    name: '+1 (248) 652-4601'
  })[0]).toHaveAttribute('href', 'tel:+12486524601');
  expect(screen.getByTitle('Take Sushi location in Rochester Hills')).toHaveAttribute('src', expect.stringContaining('google.com/maps/embed?pb='));
  expect(within(screen.getByRole('main')).getByText('Monday')).toBeInTheDocument();
  expect(within(screen.getByRole('main')).getByText('Closed')).toBeInTheDocument();
});


test('homepage category links open the corresponding existing menu category', () => {
  openRoute('/');
  const categories = screen.getByRole('navigation', { name: 'Explore menu categories' });
  fireEvent.click(within(categories).getByRole('link', { name: /Noodles/ }));
  expect(screen.getByRole('button', { name: 'Noodles' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('main').querySelectorAll('.menu-item')).toHaveLength(items.filter(item => item.category === 'Noodles').length);
});

test('an invalid category URL still displays the complete menu', () => {
  openRoute('/fullmenu?category=missing');
  expect(screen.getByRole('button', { name: 'All dishes' })).toHaveAttribute('aria-pressed', 'true');
  expect(screen.getByRole('main').querySelectorAll('.menu-item')).toHaveLength(items.length);
});


test('menu preview arrows render as SVG icons rather than literal entities', () => {
  openRoute('/');
  const categories = screen.getByRole('navigation', { name: 'Explore menu categories' });
  within(categories).getAllByRole('link').forEach(link => expect(link.querySelector('svg')).toBeInTheDocument());
  expect(screen.getByRole('main').textContent).not.toMatch(/&[A-Za-z]+;/);
});


test('gallery supports selection, keyboard navigation, and disabled end boundaries', () => {
  openRoute('/');
  const gallery = screen.getByRole('region', { name: /Every color/ });
  const prev = within(gallery).getByRole('button', { name: 'Previous gallery photos' });
  const next = within(gallery).getByRole('button', { name: 'Next gallery photos' });
  expect(prev).toBeDisabled();
  expect(next).toBeEnabled();
  fireEvent.click(next);
  expect(within(gallery).getByRole('img', { name: 'Rainbow rolls' })).toBeInTheDocument();
  fireEvent.keyDown(gallery, { key: 'End' });
  expect(next).toBeDisabled();
  expect(prev).toBeEnabled();
  fireEvent.keyDown(gallery, { key: 'ArrowLeft' });
  expect(within(gallery).getByRole('img', { name: 'Spicy crab rolls' })).toBeInTheDocument();
  fireEvent.click(within(gallery).getByRole('button', { name: 'Show Sushi and nigiri assortment' }));
  expect(prev).toBeDisabled();
  expect(within(gallery).getByRole('button', { name: 'Show Sushi and nigiri assortment' })).toHaveAttribute('aria-pressed', 'true');
  expect(within(gallery).getAllByRole('link').every(link => link.getAttribute('href') === 'https://www.instagram.com/takesushi_mi/')).toBe(true);
});

test('hero discovery link still targets the experience section', () => {
  openRoute('/');
  expect(screen.getByRole('link', { name: /SCROLL TO DISCOVER/ })).toHaveAttribute('href', '#welcome');
  expect(document.getElementById('welcome')).toBeInTheDocument();
});
