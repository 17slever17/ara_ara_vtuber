import { useEffect, useRef, useState } from 'react'
import AnimateNumbers from './AnimateNumbers'
import { Link } from 'react-router-dom'

import { useAppDispatch } from './hooks'
import { setPageName, setName } from './redux/slices/settingsSlice'
import useCounterSync from './hooks/useCounterSync'

import styles from './scss/Clicker.module.scss'
import themes from './scss/themes.module.scss'

import ArrowIcon from './assets/arrowIcon.svg?react'
import ClickParticles from './ClickParticles'

type TClickerProps = {
  id: number
  src: string
  name: string
  link: string
  sound: string
  soundsCount: number
}

const Clicker: React.FC<TClickerProps> = ({ id, src, name, link, sound, soundsCount }) => {
  const oversounds = Math.min(soundsCount - 2, Math.max(4, Math.floor(soundsCount / 5)))
  const [localCount, setLocalCount] = useState(0)
  const [currentCount, setCurrentCount] = useState(0)
  const [lastSounds, setLastSounds] = useState(Array(oversounds).fill(0))

  // Redux-настройка страницы
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setPageName(src))
    dispatch(setName(name))
  }, [dispatch, src, name])

  const { globalCount, isLoading, isError, currentCountRef, resetCurrent, syncNow } = useCounterSync(
    id,
    currentCount,
    setCurrentCount
  )

  const clickAra = () => {
    setLocalCount((prev) => prev + 1)
    setCurrentCount((prev) => prev + 1)

    // Логика звуков
    const available = [...Array(soundsCount).keys()]
      .map((i) => i + 1)
      .filter((num) => !lastSounds.includes(num))
    const choice = available[Math.floor(Math.random() * available.length)]
    const audio = new Audio(`/assets/${src}/audio/${choice}.mp3`)
    audio.play()
    setLastSounds((prev) => [...prev.slice(1), choice])
  }

  return (
    <div className={`${styles.container} ${themes[`${src}-clicker`]}`}>
      <div className='linkWrapper'>
        <Link to='/home' className={`${styles.link} ${styles.linkBtn}`}>
          <div className={`${styles.linkContainer} ${styles.linkContainerAbsolute}`}>
            <ArrowIcon className={styles.arrow} />
            <span className={'linkTitle'}>Home</span>
          </div>
        </Link>
      </div>
      <div className={styles.worldCounter}>
        {(() => {
          console.log(globalCount, 'globalCount', currentCount, 'currentCount')
          return null
        })()}
        {globalCount ? (
          <AnimateNumbers children={globalCount + currentCountRef.current} />
        ) : (
          <span className={styles.count}>—</span>
        )}
        <span className={styles.title}>Global {sound} Counter</span>
      </div>
      <div className={styles.myCounter}>
        <ClickParticles>
          <img
            className={styles.gif}
            src={`/assets/${src}/${src}.gif`}
            alt='vtuber'
            draggable='false'
            onClick={() => clickAra()}
          ></img>
        </ClickParticles>

        <div className={styles.counter}>
          <span className={styles.title}>Your {sound} Counter: </span>
          <span className={styles.count}>{localCount}</span>
        </div>
      </div>
      <div className={styles.desc}>
        <span className={styles.channel}>
          Subscribe to{' '}
          <a href={link} target='_blank'>
            {name}
          </a>
          !
        </span>
        <span className={styles.createdBy}>
          Created by{' '}
          <a href='https://www.youtube.com/@slever17' target='_blank'>
            -SleveR-
          </a>
        </span>
      </div>
    </div>
  )
}

export default Clicker
