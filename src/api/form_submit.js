import { FormResponse } from "../models/FormResponse.js"

export async function submitForm(payload) {
  console.log(payload)
  const res = await fetch(import.meta.env.VITE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log
  if (!res.ok) throw FormResponse.fromJson(data);

  const response = FormResponse.fromJson(data);
  console.log(response)
  return response
}
