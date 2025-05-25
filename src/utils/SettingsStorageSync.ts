import { useEffect, useRef } from 'react'
import { useAppSelector } from '../hooks'
import { selectSettings } from '../redux/slices/settingsSlice'

const SettingsStorageSync: React.FC = () => {
  const { backgroundPattern, fallingParticles, clickParticles } = useAppSelector(selectSettings)
  const isMounted = useRef(false)

  useEffect(() => {
    if (isMounted.current) {
      const settingsToSave = JSON.stringify({
        backgroundPattern,
        fallingParticles,
        clickParticles
      })
      localStorage.setItem('settings', settingsToSave)
    } else {
      isMounted.current = true
    }
  }, [backgroundPattern, fallingParticles, clickParticles])

  return null
}

export default SettingsStorageSync
