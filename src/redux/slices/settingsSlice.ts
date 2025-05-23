import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'

interface SettingsSliceState {
  page: string
}

export const initialState: SettingsSliceState = {
	page: 'home'
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPageName(state, action: PayloadAction<string>) {
      state.page = action.payload
    },
  }
})

export const selectSettings = (state: RootState) => state.settings
export const { setPageName, } = settingsSlice.actions

export default settingsSlice.reducer
