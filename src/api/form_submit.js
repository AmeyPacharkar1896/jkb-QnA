export async function submitForm(payload) {
  const res = await fetch(import.meta.env.VITE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error('Failed to submit');

  return res.json(); // Assuming the backend sends JSON
}
