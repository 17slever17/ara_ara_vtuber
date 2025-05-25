import styles from './scss/Menu.module.scss'
import CardBlock from './CardBlock'
import { useAppSelector, useAppDispatch } from './hooks'
import {
  selectSettings,
  setBackgroundPattern,
  setFallingParticles,
  setClickParticles
} from './redux/slices/settingsSlice'

const Menu: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const { page, clickCount } = useAppSelector(selectSettings)
  const dispatch = useAppDispatch()
  const changeStyles = (id: number, setPattern: Function) => {
    dispatch(setPattern(id))
  }
  const changeBackgroundPattern = (id: number) => {
    changeStyles(id, setBackgroundPattern)
  }
  const changeFallingParticles = (id: number) => {
    changeStyles(id, setFallingParticles)
  }
  const changeEmotes = (id: number) => {
    dispatch(setClickParticles({"id": id, "page": page}))
  }
  const sumObjectValues = () => Object.values(clickCount).reduce((acc, val) => acc + val, 0)
	const sumWithDots = (num: number) => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')

  return (
    <div className={`${styles.wrapperMenu} ${isOpen ? styles.openedMenu : ''}`}>
      <div className={styles.settingsMenu}>
        <span className={styles.countTitle}>Global Count: {sumWithDots(sumObjectValues())}</span>
        <CardBlock
          items={[1, 2, 3, 4, 5, 6]}
          src='backgrounds'
          title='Background pattern'
          onSelect={changeBackgroundPattern}
        />
        <CardBlock items={[1, 2, 3]} src='fallings' title='Falling particles' onSelect={changeFallingParticles} />
        {page !== 'home' && <span className={styles.countTitle}>Local Count: {sumWithDots(clickCount[page])}</span>}
        <CardBlock
          items={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]}
          src='emotes'
          title='Click particles'
          onSelect={changeEmotes}
        />
      </div>
    </div>
  )
}

export default Menu
