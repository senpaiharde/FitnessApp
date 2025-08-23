async function Post<T>(url: string, body: any, token?: string): Promise<T> {
  const req = await fetch(url, {
    method: 'POST',
    headers: {
      'content-Type': 'application/json',
      ...(token ? { authorization: `{Bearer ${token}}` } : {}),
      body: JSON.stringify(body),
    },
  });
  return req.json();
}


