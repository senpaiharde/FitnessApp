// src/components/pages/api.ts
export async function Post<T>(url: string, body: any, token?: string): Promise<T> {
  const req = await fetch(url, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return req.json();
}
export async function Get<T>(url: string, token?: string): Promise<T> {
  const req = await fetch(url, {
    method: 'GET',
    headers: {
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
  });
  return req.json();
}