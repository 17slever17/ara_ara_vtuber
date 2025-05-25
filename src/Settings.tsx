import { useState } from 'react'
import { useAppSelector } from './hooks'
import { selectSettings } from './redux/slices/settingsSlice'
import styles from './scss/Menu.module.scss'
import themes from './scss/themes.module.scss'
import Gear from './assets/gear.svg?react'
import Menu from './Menu'

const Settings: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { page } = useAppSelector(selectSettings)
  return (
    <div className={styles.container}>
      <button
        className={styles.menuButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label='Toggle menu'
      >
        <Gear className={`${styles.gear} ${isOpen ? styles.open : ''} ${themes[`${page}-gear`]}`} />
      </button>
      <Menu isOpen={isOpen} />
    </div>
  )
}

export default Settings
