import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { goals } from '../../CardBlock'
import { calcTotalCount } from '../../utils/calcTotalCount'

const getInitialSettings = (): Partial<SettingsSliceState> => {
  try {
    const data = localStorage.getItem('settings')
    if (!data) return {}
    return JSON.parse(data)
  } catch {
    return {}
  }
}

interface SettingsSliceState {
  page: string
  name: string
  backgroundPattern: number | null
  fallingParticles: number | null
  clickParticles: { [name: string]: number[] }
  clickCount: { [name: string]: number }
}

export const initialState: SettingsSliceState = {
  page: 'home',
  name: 'home',
  backgroundPattern: null,
  fallingParticles: null,
  clickParticles: {
    'shylily-womp-womp': [1],
    'calli-ara-ara': [1],
    'filian-ara-ara': [1],
    'gura-ara-ara': [1],
    'shylily-ara-ara': [1],
    'kobo-ara-ara': [1]
  },
  clickCount: {
    'shylily-womp-womp': 1120000,
    'calli-ara-ara': 1200000,
    'filian-ara-ara': 1300000,
    'gura-ara-ara': 14000000,
    'shylily-ara-ara': 150000000,
    'kobo-ara-ara': 16000000
  },
  ...getInitialSettings()
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setPageName(state, action: PayloadAction<string>) {
      state.page = action.payload
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload
    },
    setBackgroundPattern(state, action: PayloadAction<number | null>) {
      if (
        goals.global.backgrounds[action.payload ? action.payload.toString() : ''] <= calcTotalCount(state.clickCount)
      ) {
        if (state.backgroundPattern === action.payload) {
          state.backgroundPattern = null
        } else state.backgroundPattern = action.payload
      }
    },
    setFallingParticles(state, action: PayloadAction<number | null>) {
      if (goals.global.fallings[action.payload ? action.payload.toString() : ''] <= calcTotalCount(state.clickCount)) {
        if (state.fallingParticles === action.payload) {
          state.fallingParticles = null
        } else state.fallingParticles = action.payload
      }
    },
    setClickParticles(state, action: PayloadAction<{ id: number; page: string }>) {
      if (goals.local[action.payload['id'].toString()] <= state.clickCount[action.payload['page']]) {
        const index = state.clickParticles[action.payload['page']].indexOf(action.payload['id'])
        if (index !== -1) {
          if (state.clickParticles[action.payload['page']].length > 1)
            state.clickParticles[action.payload['page']].splice(index, 1)
        } else state.clickParticles[action.payload['page']].push(action.payload['id'])
      }
    }
  }
})

export const selectSettings = (state: RootState) => state.settings
export const { setPageName, setName, setBackgroundPattern, setFallingParticles, setClickParticles } =
  settingsSlice.actions

export default settingsSlice.reducer
