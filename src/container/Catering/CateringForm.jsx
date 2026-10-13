import React, { useRef, useState } from 'react';
import { FiArrowUpRight, FiCheck } from 'react-icons/fi';
import { cateringEvents, cateringSelections } from '../../constants/catering';
import { sendInquiry, localDate, validateInquiry } from './inquiry';
const initial = {
  name: '',
  email: '',
  phone: '',
  date: '',
  guests: '',
  event: '',
  preference: '',
  location: '',
  selections: [],
  budget: '',
  requests: '',
  website: ''
};
export default function CateringForm() {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [message, setMessage] = useState('');
  const submitting = useRef(false);
  const form = useRef(null);
  const startedAt = useRef(Date.now());
  const request = useRef(null);
  const update = (key, value) => {
    setValues(current => ({
      ...current,
      [key]: value
    }));
    setAccepted(false);
    setFailed(false);
    request.current = null;
    setMessage('');
    setErrors(current => ({
      ...current,
      [key]: undefined
    }));
  };
  const submit = async event => {
    event.preventDefault();
    if (submitting.current || accepted) return;
    setFailed(false);
    if (values.website) {
      setFailed(true);
      setMessage('We could not send this inquiry. Please call (248) 652-7800.');
      return;
    }
    const invalid = validateInquiry(values);
    setErrors(invalid);
    if (Object.keys(invalid).length) {
      setFailed(true);
      setMessage('Please correct the highlighted fields.');
      form.current.querySelector(`[name="${Object.keys(invalid)[0]}"]`)?.focus();
      return;
    }
    submitting.current = true;
    setBusy(true);
    setMessage('Sending your catering inquiry...');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    try {
      if (!request.current) {
        const bytes = new Uint8Array(16);
        window.crypto.getRandomValues(bytes);
        bytes[6] = (bytes[6] & 15) | 64;
        bytes[8] = (bytes[8] & 63) | 128;
        const hex = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
        const requestId = `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
        request.current = { ...values, startedAt: startedAt.current, requestId };
      }
      await sendInquiry(request.current, controller.signal);
      setAccepted(true);
      setMessage('Thank you. Your catering inquiry has been submitted. Our team will review your request; your event is not confirmed.');
    } catch (error) {
      setFailed(true);
      if (error.fields && typeof error.fields === 'object') {
        const fields = Object.fromEntries(Object.entries(error.fields).filter(([key, value]) => key in initial && typeof value === 'string'));
        setErrors(fields);
        setTimeout(() => form.current?.querySelector(`[name="${Object.keys(fields)[0]}"]`)?.focus(), 0);
      }
      setMessage(error.name === 'AbortError'
        ? 'We could not confirm your inquiry was sent. Your details are saved here. Please retry or call (248) 652-7800.'
        : error.message || 'We could not send your inquiry. Please retry or call (248) 652-7800.');
    } finally {
      clearTimeout(timer);
      submitting.current = false;
      setBusy(false);
    }
  };
  const field = (name, label, type = 'text', extra = {}) => <div className="inquiry-field">
    <label htmlFor={`catering-${name}`}>
      {label}
      <span aria-hidden="true">*</span>
    </label>
    <input id={`catering-${name}`} name={name} type={type} value={values[name]} onChange={e => update(name, e.target.value)} required aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined} {...extra} />
    {errors[name] && <p className="field-error" id={`error-${name}`}>{errors[name]}</p>}
  </div>;
  const select = (name, label, options) => <div className="inquiry-field">
    <label htmlFor={`catering-${name}`}>
      {label}
      <span aria-hidden="true">*</span>
    </label>
    <select id={`catering-${name}`} name={name} value={values[name]} onChange={e => update(name, e.target.value)} required aria-invalid={!!errors[name]} aria-describedby={errors[name] ? `error-${name}` : undefined}>
      <option value="">Please choose</option>
      {options.map(option => <option key={option}>{option}</option>)}
    </select>
    {errors[name] && <p className="field-error" id={`error-${name}`}>{errors[name]}</p>}
  </div>;
  return <form ref={form} className="catering-form" onSubmit={submit} noValidate aria-busy={busy}>
    <p className="form-note">Fields marked * are required. Submit an inquiry to discuss availability and receive a quote.</p>
    <fieldset disabled={busy || accepted} className="inquiry-fields">
      <legend className="sr-only">Your catering inquiry</legend>
      {field('name', 'Customer name', 'text', {
        autoComplete: 'name',
        maxLength: 100
      })}
      {field('email', 'Email', 'email', {
        autoComplete: 'email',
        maxLength: 150
      })}
      {field('phone', 'Phone', 'tel', {
        autoComplete: 'tel',
        maxLength: 30
      })}
      {field('date', 'Event date', 'date', {
        min: localDate()
      })}
      {field('guests', 'Estimated number of guests', 'number', {
        min: 1,
        step: 1
      })}
      {select('event', 'Event type', cateringEvents)}
      {select('preference', 'Pickup or delivery preference', ['Pickup', 'Delivery'])}
      {values.preference === 'Delivery' && field('location', 'Event location', 'text', {
        autoComplete: 'street-address',
        maxLength: 300
      })}
      <fieldset className="inquiry-interests">
        <legend>Catering selections of interest *</legend>
        {cateringSelections.map(selection => <label key={selection}>
          <input name="selections" type="checkbox" value={selection} checked={values.selections.includes(selection)} onChange={e => update('selections', e.target.checked ? [...values.selections, selection] : values.selections.filter(item => item !== selection))} aria-invalid={!!errors.selections} aria-describedby={errors.selections ? 'error-selections' : undefined} />
          {selection}
        </label>)}
        {errors.selections && <p className="field-error" id="error-selections">{errors.selections}</p>}
      </fieldset>
      <div className="inquiry-field">
        <label htmlFor="catering-budget">Budget range (optional)</label>
        <input id="catering-budget" value={values.budget} onChange={e => update('budget', e.target.value)} maxLength={100} />
      </div>
      <div className="inquiry-field inquiry-wide">
        <label htmlFor="catering-requests">Additional requests (optional)</label>
        <textarea id="catering-requests" rows={4} value={values.requests} maxLength={2000} onChange={e => update('requests', e.target.value)} />
      </div>
      <div className="inquiry-honeypot" aria-hidden="true">
        <label htmlFor="catering-website">Leave this field empty</label>
        <input id="catering-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={e => update('website', e.target.value)} />
      </div>
    </fieldset>
    <p className="form-note">Availability, pricing, pickup arrangements, and any delivery request require restaurant approval. Submitting an inquiry does not reserve your event or confirm an order.</p>
    <button type="submit" className="button" disabled={busy || accepted}>{busy ? 'Sending inquiry...' : accepted ? 'Inquiry submitted' : failed ? 'Try sending again' : 'Request a catering quote'} {accepted ? <FiCheck aria-hidden="true" /> : <FiArrowUpRight aria-hidden="true" />}</button>
    {message && <p className="inquiry-message" role={failed ? 'alert' : 'status'}>{message}</p>}
    {failed && <p className="form-note">Your details are still in the form. You can also <a href="tel:+12486527800">call (248) 652-7800</a> to discuss your event.</p>}
  </form>;
}
