const BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

async function post(path, body) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(`${BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    let data = {};
    try {
      data = await res.json();
    } catch {
      /* non-JSON response */
    }
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status}).`);
    return data;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('The request timed out. Please try again.');
    if (err instanceof TypeError) throw new Error('Could not reach the server. Please try again shortly.');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

export const sendContact = (payload) => post('/api/contact', payload);
export const askSuryaAI = (messages) => post('/api/chat', { messages });
