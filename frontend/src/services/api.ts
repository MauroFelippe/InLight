const BASE_URL = 'http://192.168.1.9:3000';

export async function post(path: string, body: any) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro na requisição');
  }

  return response.json();
}

export async function get(path: string) {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro na requisição');
  }

  return response.json();
}

export async function patch(path: string, body: any) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erro na requisição');
  }

  return response.json();
}

