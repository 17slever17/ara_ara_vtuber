import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from './hooks/hooks'
import { selectSettings } from './redux/slices/settingsSlice'
import styles from './scss/Menu.module.scss'
import themes from './scss/themes.module.scss'
import Gear from './assets/gear.svg?react'
import Menu from './Menu'

const Settings: React.FC<{}> = () => {
  const [isOpen, setIsOpen] = useState(false)
  const openedRef = useRef(isOpen)
  useEffect(() => {
    openedRef.current = isOpen
  }, [isOpen])
  const { slug } = useAppSelector(selectSettings)
  return (
    <div className={styles.container}>
      <button className={styles.menuButton} onClick={() => setIsOpen((prev) => !prev)} aria-label='Toggle menu'>
        <Gear className={`${styles.gear} ${openedRef.current ? styles.open : ''} ${themes[`${slug}-gear`]}`} />
      </button>
      <Menu isOpen={isOpen} openedRef={openedRef} />
    </div>
  )
}

export default Settings
