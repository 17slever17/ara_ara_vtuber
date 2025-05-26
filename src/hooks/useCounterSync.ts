import { useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../api/apiClient'

function useCounterSync(
  id: string | number,
  currentCount: number,
  setCurrentCount: (count: number) => void
) {
  const queryClient = useQueryClient()
  const currentCountRef = useRef(currentCount)

  // Обновляем ref при каждом изменении currentCount
  useEffect(() => {
    currentCountRef.current = currentCount
  }, [currentCount])

  // Запрос глобального счётчика
  const {
    data: globalCount = 0,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['counter', id],
    queryFn: async () => {
      const data = await apiFetch<{ data: { total: number } }>(`/phrases/${id}/total`)
      console.log(data, 'get')
      if (typeof data.data.total !== 'number') {
        throw new Error('Сервер не вернул count')
      }
      return data.data.total
    },
    // первый запрос только один раз, без авто-рефетча
    refetchOnMount: false,
    refetchOnWindowFocus: false
  })

  // Мутация для инкремента
  const { mutateAsync } = useMutation({
    mutationFn: async (incrementAmount: number) => {
      const data = await apiFetch<{ data: { total: number } }>(`/phrases/${id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: incrementAmount })
      })
      console.log(data, 'post')
      return data.data.total
    }
  })

  // Функция синхронизации
  const syncNow = async () => {
    try {
      if (currentCountRef.current !== 0) {
        // инкремент на amount = накопленные клики

        const newValue = await mutateAsync(currentCountRef.current)
        queryClient.setQueryData(['counter', id], newValue)
        setCurrentCount(0)
      } else {
        // просто обновить значение
        await refetch()
      }
    } catch (e) {
      console.error('Sync failed:', e)
    }
  }

  // Интервал синхронизации каждые 10 секунд
  useEffect(() => {
    const tick = () => {
      if (!document.hidden || currentCountRef.current !== 0) {
				console.log(currentCountRef.current, 'ref')
        syncNow()
      }
    }

    const timerId = setInterval(tick, 10000)
    return () => {
      clearInterval(timerId)
      // при размонтировании — финальная синхронизация
      if (currentCountRef.current !== 0) {
        mutateAsync(currentCountRef.current)
          .then((newValue) => {
            queryClient.setQueryData(['counter', id], newValue)
            setCurrentCount(0)
          })
          .catch(console.error)
      } else {
        refetch().catch(console.error)
      }
    }
  }, [id])

  return {
    globalCount,
    isLoading,
    isError,
		currentCountRef,
    resetCurrent: () => setCurrentCount(0),
    syncNow
  }
}

export default useCounterSync
