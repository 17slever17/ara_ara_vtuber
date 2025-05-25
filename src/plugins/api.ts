import { useEffect, useState } from 'react'

export default function useFetch(url: string, method: string = 'GET') {
  const [response, setData] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()

  const fullUrl: string = (import.meta.env.VITE_API_URL ?? '') + url

  const token = localStorage.getItem('auth_token') // или куки луше 

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  async function fetchData() {
    setIsLoading(true)
    try {
      const res = await fetch(fullUrl, {
        method,
        headers,
      })
      const json = await res.json()
      setData(json)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  function refetch() {
    fetchData()
  }

  return { response, isLoading, error, refetch }
}
