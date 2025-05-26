
const API_URL = import.meta.env.VITE_API_URL
//'http://localhost:5000/api'
export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {})
    },
    ...options
  })

  if (!res.ok) {
    const errorText = await res.text()
    throw new Error(`Ошибка API: ${res.status} ${errorText}`)
  }

  return await res.json()
}
