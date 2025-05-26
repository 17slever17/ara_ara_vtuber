import { useEffect, MutableRefObject, Dispatch, SetStateAction, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../../api/apiClient'
import { useAppDispatch } from './hooks'
import { setLocalCount } from '../redux/slices/settingsSlice'

function useCounterSync(
  id: string | number,
  setMyLocalCount: Dispatch<SetStateAction<number>>,
  pendingRef: MutableRefObject<number>
) {
  const lastSyncTimeRef = useRef(Date.now())
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  // Запрос глобального счётчика
  const {
    data = { clicks: 0, slug: '' },
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['counter', id],
    queryFn: async () => {
      const data = await apiFetch<{ data: { clicks: number; slug: string }, message: string }>(`/phrases/${id}/total`)
      console.log(data.data, 'get data')
      if (data.message === 'Error') {
        throw new Error('Ошибка получения локального количества кликов')
      }
      return data.data
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  // Мутация для инкремента
  const { mutateAsync } = useMutation({
    mutationFn: async (incrementAmount: number) => {
      const data = await apiFetch<{ data: { clicks: number; slug: string } }>(`/phrases/${id}/add-clicks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: incrementAmount })
      })
      console.log(data.data, 'post data')
      return data.data
    }
  })

  // Функция синхронизации
  const syncNow = async () => {
    try {
      const amount = pendingRef.current
      if (amount !== 0) {
        pendingRef.current = 0
        // инкремент на amount = накопленные клики
        const data = await mutateAsync(amount)
        queryClient.setQueryData(['counter', id], data)
        dispatch(setLocalCount({ count: data.clicks, slug: data.slug }))
        setMyLocalCount((lc) => Math.max(0, lc - amount))
        lastSyncTimeRef.current = Date.now()
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
		refetch()
		lastSyncTimeRef.current = Date.now()
    const tick = () => {
      const now = Date.now()
      const timePassed = now - lastSyncTimeRef.current

      if ((!document.hidden && timePassed >= 10000) || pendingRef.current !== 0) {
        syncNow()
      }
    }

    const timerId = setInterval(tick, 10000)
    return () => {
      clearInterval(timerId)
      // при размонтировании — финальная синхронизация
      const amount = pendingRef.current
      if (amount !== 0) {
        mutateAsync(pendingRef.current)
          .then((data) => {
            queryClient.setQueryData(['counter', id], data.clicks)
            pendingRef.current = 0
          })
          .catch(console.error)
      }
    }
  }, [id])

  useEffect(() => {
    if (data?.clicks !== undefined) {
      dispatch(setLocalCount({ count: data.clicks, slug: data.slug }))
    }
  }, [data, dispatch])

  return {
    globalCount: data?.clicks ?? 0,
    isLoading,
    isError,
    syncNow
  }
}

export default useCounterSync
