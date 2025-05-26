import { MutableRefObject, useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '../../api/apiClient'
import { useAppDispatch } from './hooks'
import { setGlobalCount } from '../redux/slices/settingsSlice'

function useGetAmount(openedRef: MutableRefObject<boolean>) {
  const lastSyncTimeRef = useRef(Date.now())
  const dispatch = useAppDispatch()

  // Запрос глобального счётчика
  const {
    data = 0,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['global-total-count'],
    queryFn: async () => {
      const data = await apiFetch<{ entities: {clicks: number}, message: string }>(`/clicks/total`)
      console.log(data, 'get')
      if (data.message === 'Error') {
        throw new Error('Ошибка получения глобального количества кликов')
      }
      return data.entities.clicks
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false
  })

  // Функция синхронизации
  const syncNow = async () => {
    try {
      await refetch()
    } catch (e) {
      console.error('Sync failed:', e)
    }
  }

  // Интервал синхронизации каждые 10 секунд
  useEffect(() => {
    const tick = () => {
      const now = Date.now()
      const timePassed = now - lastSyncTimeRef.current
      if (openedRef.current && !document.hidden && timePassed >= 10000) {
        syncNow()
      }
    }

    const timerId = setInterval(tick, 10000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  useEffect(() => {
    if (data !== undefined) {
      dispatch(setGlobalCount(data))
    }
  }, [data, dispatch])

  return {
    globalCount: data,
    isLoading,
    isError,
    syncNow
  }
}

export default useGetAmount
