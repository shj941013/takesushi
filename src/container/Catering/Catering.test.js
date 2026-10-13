import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CateringForm from './CateringForm';
import { validateInquiry } from './inquiry';

const valid = { name: 'Guest & Family', email: 'guest@example.com', phone: '(248) 555-0100', date: '2099-11-05', guests: '20', event: 'Private parties', preference: 'Pickup', location: '', selections: ['Classic sushi rolls'], budget: '', requests: 'No peanuts & extra napkins', website: '' };
function completeForm() {
  Object.entries({ 'Customer name': valid.name, Email: valid.email, Phone: valid.phone, 'Event date': valid.date, 'Estimated number of guests': valid.guests, 'Event type': valid.event, 'Pickup or delivery preference': valid.preference }).forEach(([name,value]) => fireEvent.change(screen.getByLabelText(new RegExp(`^${name}`)), { target: { value } }));
  fireEvent.click(screen.getByLabelText('Classic sushi rolls'));
}

test('required field errors are specific and focus the first invalid field', () => {
  render(<CateringForm />);
  fireEvent.click(screen.getByRole('button', { name: 'Request a catering quote' }));
  expect(screen.getByText('Please enter your name.')).toBeInTheDocument();
  expect(screen.getByText('Please enter a valid email address.')).toBeInTheDocument();
  expect(screen.getByText('Please choose at least one of the listed catering selections.')).toBeInTheDocument();
  expect(screen.getByLabelText(/^Customer name/)).toHaveFocus();
  expect(screen.queryByRole('link', { name: /Open email draft/ })).not.toBeInTheDocument();
});

test('delivery requires a location and pickup does not', () => {
  expect(validateInquiry(valid)).toEqual({});
  expect(validateInquiry({ ...valid, preference: 'Delivery' }).location).toBeDefined();
  expect(validateInquiry({ ...valid, guests: '2.5' }).guests).toBeDefined();
  expect(validateInquiry({ ...valid, date: '2000-01-01' }).date).toBeDefined();
  render(<CateringForm />);
  fireEvent.change(screen.getByLabelText(/^Pickup or delivery/), { target: { value: 'Delivery' } });
  expect(screen.getByLabelText(/^Event location/)).toBeRequired();
  fireEvent.change(screen.getByLabelText(/^Pickup or delivery/), { target: { value: 'Pickup' } });
  expect(screen.queryByLabelText(/^Event location/)).not.toBeInTheDocument();
});

beforeEach(() => {
  global.fetch = jest.fn();
  Object.defineProperty(window, 'crypto', { configurable: true, value: { getRandomValues: array => require('crypto').randomFillSync(array) } });
});
afterEach(() => { delete global.fetch; });

const accepted = () => ({ ok: true, status: 200, json: async () => ({ accepted: true, emailId: 'mock-email-id' }) });

test('valid inquiries submit once and succeed only after provider acceptance', async () => {
  let resolve;
  fetch.mockImplementation(() => new Promise(done => { resolve = done; }));
  render(<CateringForm />);
  completeForm();
  fireEvent.click(screen.getByRole('button', { name: 'Request a catering quote' }));
  expect(screen.getByRole('button', { name: /Sending inquiry/ })).toBeDisabled();
  expect(screen.getByLabelText(/^Customer name/)).toBeDisabled();
  expect(fetch).toHaveBeenCalledTimes(1);
  expect(fetch.mock.calls[0][0]).toBe('/api/catering-inquiry');
  resolve(accepted());
  await screen.findByRole('button', { name: /Inquiry submitted/ });
  expect(screen.getByRole('status')).toHaveTextContent('your event is not confirmed');
  expect(screen.queryByRole('link', { name: /email draft/ })).not.toBeInTheDocument();
});

test('failure preserves fields and retry reuses the same idempotency request ID', async () => {
  fetch.mockResolvedValueOnce({ ok: false, status: 503, json: async () => ({ message: 'Please try again.' }) }).mockResolvedValueOnce(accepted());
  render(<CateringForm />);
  completeForm();
  fireEvent.click(screen.getByRole('button', { name: 'Request a catering quote' }));
  await screen.findByRole('alert');
  expect(screen.getByLabelText(/^Customer name/)).toHaveValue(valid.name);
  expect(screen.getByLabelText(/^Email/)).toHaveValue(valid.email);
  fireEvent.click(screen.getByRole('button', { name: 'Try sending again' }));
  await screen.findByRole('button', { name: /Inquiry submitted/ });
  const first = JSON.parse(fetch.mock.calls[0][1].body);
  const second = JSON.parse(fetch.mock.calls[1][1].body);
  expect(first.requestId).toBe(second.requestId);
  expect(first.startedAt).toBe(second.startedAt);
});

test('network errors and successful HTTP responses without acceptance never show success', async () => {
  fetch.mockRejectedValueOnce(new Error('Network unavailable')).mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({}) });
  render(<CateringForm />);
  completeForm();
  fireEvent.click(screen.getByRole('button', { name: 'Request a catering quote' }));
  await screen.findByRole('alert');
  fireEvent.click(screen.getByRole('button', { name: 'Try sending again' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Try sending again' })).toBeEnabled());
  expect(screen.queryByRole('button', { name: /Inquiry submitted/ })).not.toBeInTheDocument();
});

test('server validation errors map to the existing fields', async () => {
  fetch.mockResolvedValue({ ok: false, status: 422, json: async () => ({ message: 'Please correct the highlighted fields.', errors: { email: 'Check this email address.' } }) });
  render(<CateringForm />);
  completeForm();
  fireEvent.click(screen.getByRole('button', { name: 'Request a catering quote' }));
  expect(await screen.findByText('Check this email address.')).toBeInTheDocument();
  expect(screen.getByLabelText(/^Email/)).toHaveAttribute('aria-invalid', 'true');
});

test('honeypot blocks submission rather than faking success', () => {
  render(<CateringForm />);
  completeForm();
  fireEvent.change(document.getElementById('catering-website'), { target: { value: 'spam.example' } });
  fireEvent.click(screen.getByRole('button', { name: 'Request a catering quote' }));
  expect(screen.getByRole('alert')).toHaveTextContent('We could not send this inquiry');
  expect(fetch).not.toHaveBeenCalled();
});
