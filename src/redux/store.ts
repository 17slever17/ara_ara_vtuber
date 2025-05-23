import { configureStore } from '@reduxjs/toolkit'
import settings from './slices/settingsSlice'

export const store = configureStore({
  reducer: {
    settings,
  }
})

type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
