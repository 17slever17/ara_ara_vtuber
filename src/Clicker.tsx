import { useEffect, useState, useRef } from 'react'
import AnimateNumbers from './AnimateNumbers'
import { Link } from 'react-router-dom'

import { useAppDispatch } from './hooks/hooks'
import { setSlug, setName } from './redux/slices/settingsSlice'
import useCounterSync from './hooks/useCounterSync'

import styles from './scss/Clicker.module.scss'
import themes from './scss/themes.module.scss'

import ArrowIcon from './assets/arrowIcon.svg?react'
import ClickParticles from './ClickParticles'

type TClickerProps = {
  id: number
  slug: string
  name: string
  link: string
  sound: string
  soundsCount: number
}

const Clicker: React.FC<TClickerProps> = ({ id, slug, name, link, sound, soundsCount }) => {
  const oversounds = Math.min(soundsCount - 2, Math.max(4, Math.floor(soundsCount / 5)))
  const [myLocalCount, setMyLocalCount] = useState(0)
  const pendingRef = useRef(0)
  const [lastSounds, setLastSounds] = useState(Array(oversounds).fill(0))

  // Redux-настройка страницы
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setSlug(slug))
    dispatch(setName(name))
  }, [dispatch, slug, name])

  const { globalCount, isLoading, isError, syncNow } = useCounterSync(id, setMyLocalCount, pendingRef)

  const clickAra = () => {
    setMyLocalCount((prev) => prev + 1)
    pendingRef.current += 1
    const available = [...Array(soundsCount).keys()].map((i) => i + 1).filter((num) => !lastSounds.includes(num))
    const choice = available[Math.floor(Math.random() * available.length)]
    const audio = new Audio(`/assets/${slug}/audio/${choice}.mp3`)
    audio.play()
    setLastSounds((prev) => [...prev.slice(1), choice])
  }

  return (
    <div className={`${styles.container} ${themes[`${slug}-clicker`]}`}>
      <div className='linkWrapper'>
        <Link to='/home' className={`${styles.link} ${styles.linkBtn}`}>
          <div className={`${styles.linkContainer} ${styles.linkContainerAbsolute}`}>
            <ArrowIcon className={styles.arrow} />
            <span className={'linkTitle'}>Home</span>
          </div>
        </Link>
      </div>
      <div className={styles.worldCounter}>
        {globalCount ? (
          <AnimateNumbers children={globalCount + myLocalCount} />
        ) : (
          <span className={styles.count}>—</span>
        )}
        <span className={styles.title}>Global {sound} Counter</span>
      </div>
      <div className={styles.myCounter}>
        <ClickParticles>
          <img
            className={styles.gif}
            src={`/assets/${slug}/${slug}.gif`}
            alt='vtuber'
            draggable='false'
            onClick={() => clickAra()}
          ></img>
        </ClickParticles>

        <div className={styles.counter}>
          <span className={styles.title}>Your {sound} Counter: </span>
          <span className={styles.count}>{myLocalCount}</span>
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
