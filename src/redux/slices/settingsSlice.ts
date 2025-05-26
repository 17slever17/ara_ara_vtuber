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
  slug: string
  name: string
  backgroundPattern: number | null
  fallingParticles: number | null
  clickParticles: { [name: string]: number[] }
  localCounts: { [name: string]: number }
  globalCount: number
}

export const initialState: SettingsSliceState = {
  slug: 'home',
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
  localCounts: {
    'shylily-womp-womp': 1120000,
    'calli-ara-ara': 1200000,
    'filian-ara-ara': 1300000,
    'gura-ara-ara': 14000000,
    'shylily-ara-ara': 150000000,
    'kobo-ara-ara': 16000000
  },
  globalCount: 0,
  ...getInitialSettings()
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSlug(state, action: PayloadAction<string>) {
      state.slug = action.payload
    },
    setName(state, action: PayloadAction<string>) {
      state.name = action.payload
    },
    setLocalCount(state, action: PayloadAction<{ count: number; slug: string }>) {
      const { slug, count } = action.payload
      state.localCounts = {
        ...state.localCounts,
        [slug]: count
      }
    },
    setGlobalCount(state, action: PayloadAction<number>) {
      state.globalCount = action.payload
    },
    setBackgroundPattern(state, action: PayloadAction<number | null>) {
      if (
        goals.global.backgrounds[action.payload ? action.payload.toString() : ''] <= calcTotalCount(state.localCounts)
      ) {
        if (state.backgroundPattern === action.payload) {
          state.backgroundPattern = null
        } else state.backgroundPattern = action.payload
      }
    },
    setFallingParticles(state, action: PayloadAction<number | null>) {
      if (goals.global.fallings[action.payload ? action.payload.toString() : ''] <= calcTotalCount(state.localCounts)) {
        if (state.fallingParticles === action.payload) {
          state.fallingParticles = null
        } else state.fallingParticles = action.payload
      }
    },
    setClickParticles(state, action: PayloadAction<{ id: number; slug: string }>) {
      if (goals.local[action.payload['id'].toString()] <= state.localCounts[action.payload['slug']]) {
        const index = state.clickParticles[action.payload['slug']].indexOf(action.payload['id'])
        if (index !== -1) {
          if (state.clickParticles[action.payload['slug']].length > 1)
            state.clickParticles[action.payload['slug']].splice(index, 1)
        } else state.clickParticles[action.payload['slug']].push(action.payload['id'])
      }
    }
  }
})

export const selectSettings = (state: RootState) => state.settings
export const {
  setSlug,
  setName,
  setLocalCount,
  setGlobalCount,
  setBackgroundPattern,
  setFallingParticles,
  setClickParticles
} = settingsSlice.actions

export default settingsSlice.reducer
