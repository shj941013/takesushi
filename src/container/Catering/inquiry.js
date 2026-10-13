import catering from '../../shared/catering.mjs';
export const { localDate, validateInquiry } = catering;

export async function sendInquiry(payload, signal) {
  let response;
  try { response = await fetch('/api/catering-inquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
    body: JSON.stringify(payload),
    signal,
  }); } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('We could not reach the inquiry service. Please retry or call (248) 652-7800.');
  }
  let result;
  try { result = await response.json(); } catch { result = null; }
  if (!response.ok || result?.accepted !== true || typeof result.emailId !== 'string' || !result.emailId) {
    const error = new Error(response.status === 429
      ? result?.message || 'Too many requests. Please wait two minutes before trying again, or call (248) 652-7800.'
      : result?.message || 'We could not send your inquiry. Please try again or call (248) 652-7800.');
    error.fields = result?.errors;
    throw error;
  }
  return result;
}
