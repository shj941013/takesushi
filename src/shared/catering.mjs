const cateringSelections = ['Classic sushi rolls', 'Specialty rolls', 'Nigiri and sashimi', 'Vegetarian selections', 'Custom sushi platters'];
const cateringEvents = ['Corporate lunches and meetings', 'Weddings and receptions', 'Birthday celebrations', 'Private parties', 'Special events'];
const limits = { name: 100, email: 150, phone: 30, location: 300, budget: 100, requests: 2000, website: 200 };

function localDate(now = new Date()) {
  // The restaurant's calendar date, independent of browser/server timezone.
  const parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Detroit', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const value = type => parts.find(part => part.type === type).value;
  return `${value('year')}-${value('month')}-${value('day')}`;
}

function isEmail(value) {
  return typeof value === 'string' && value.length <= limits.email && /^[^\s<>@,;"\r\n]+@[^\s<>@,;"\r\n]+\.[^\s<>@,;"\r\n]+$/.test(value);
}

function normalizeInquiry(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const fields = ['name', 'email', 'phone', 'date', 'guests', 'event', 'preference', 'location', 'budget', 'requests', 'website'];
  const result = {};
  for (const field of fields) {
    const value = input[field];
    if (value === undefined && ['location', 'budget', 'requests', 'website'].includes(field)) result[field] = '';
    else if (typeof value === 'string') result[field] = value.trim();
    else return null;
  }
  if (!Array.isArray(input.selections) || !input.selections.every(value => typeof value === 'string')) return null;
  result.selections = [...new Set(input.selections)];
  return result;
}

function validateInquiry(input, now = new Date()) {
  const values = normalizeInquiry(input);
  if (!values) return { form: 'Please check the inquiry details and try again.' };
  const errors = {};
  for (const [field, limit] of Object.entries(limits)) {
    if (values[field].length > limit) errors[field] = `Please keep this field to ${limit} characters or fewer.`;
  }
  for (const field of ['name', 'email', 'phone', 'location', 'budget']) {
    if (Array.from(values[field]).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127)) errors[field] = 'Please remove line breaks or unsupported characters.';
  }
  if (!values.name) errors.name = 'Please enter your name.';
  if (!isEmail(values.email)) errors.email = 'Please enter a valid email address.';
  const digits = values.phone.replace(/\D/g, '');
  if (!/^[+() .\-0-9]+$/.test(values.phone) || digits.length < 7 || digits.length > 15) errors.phone = 'Please enter a valid phone number, including area code.';
  const parsedDate = new Date(`${values.date}T12:00:00Z`);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(values.date) || Number.isNaN(parsedDate.getTime()) || parsedDate.toISOString().slice(0, 10) !== values.date || values.date < localDate(now)) errors.date = 'Please select today or a future event date.';
  if (!/^\d+$/.test(values.guests) || !Number.isSafeInteger(Number(values.guests)) || Number(values.guests) < 1) errors.guests = 'Please enter a whole number of guests, at least 1.';
  if (!cateringEvents.includes(values.event)) errors.event = 'Please choose an event type.';
  if (!['Pickup', 'Delivery'].includes(values.preference)) errors.preference = 'Please choose pickup or delivery.';
  if (values.preference === 'Delivery' && !values.location) errors.location = 'Please enter the requested delivery location.';
  if (!values.selections.length || values.selections.length > cateringSelections.length || values.selections.some(value => !cateringSelections.includes(value))) errors.selections = 'Please choose at least one of the listed catering selections.';
  if (values.requests.includes(String.fromCharCode(0))) errors.requests = 'Please remove unsupported characters.';
  return errors;
}

export { cateringSelections, cateringEvents, limits, localDate, isEmail, normalizeInquiry, validateInquiry };
const catering = { cateringSelections, cateringEvents, limits, localDate, isEmail, normalizeInquiry, validateInquiry };
export default catering;
