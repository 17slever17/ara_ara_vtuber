import { useEffect, useRef, useState } from 'react'
import { usePageVisibility } from 'react-page-visibility'
import AnimateNumbers from './AnimateNumbers'
import axios from 'axios'
import { Link } from 'react-router-dom'

import { useAppDispatch } from './hooks'
import { setPageName, setName } from './redux/slices/settingsSlice'

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
  const [count, setCount] = useState(0)
  const [currentCount, setCurrentCount] = useState(0)
  const [time, setTime] = useState(10)
  const [wcount, setWcount] = useState(0)
  const [lastSounds, setLastSounds] = useState(Array(oversounds).fill(0))
  const isPageVisible = usePageVisibility()

  const currentCountRef = useRef(currentCount)

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setPageName(src))
    dispatch(setName(name))
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)
    return () => {
      clearInterval(intervalId)
      fetchData()
    }
  }, [])

  useEffect(() => {
    currentCountRef.current = currentCount
  }, [currentCount])

  useEffect(() => {
    if (time >= 10 && (isPageVisible || currentCount !== 0)) {
      setTime(0)
      fetchData()
    }
  }, [time, isPageVisible, currentCount])

  async function fetchData() {
    try {
      const getResponse = await axios.get(`/api/mokky-proxy?path=counter/${id}`)
      const counter = getResponse.data
      if (!counter) {
        console.error('Нет данных для обновления')
        return
      }

      const newCount = counter.count + currentCountRef.current
      setWcount(newCount)

      if (newCount !== wcount) {
        if (currentCountRef.current !== 0) {
          setCurrentCount(0)
          await axios.patch(`/api/mokky-proxy?path=counter/${id}`, { count: newCount })
        }
      }
    } catch (error) {
      console.error('Ошибка:', error)
    }
  }

  const clickAra = () => {
    setCount((prev) => prev + 1)
    setCurrentCount((prev) => prev + 1)
    const sounds = [...Array(soundsCount).keys()].map((i) => i + 1).filter((num) => !lastSounds.includes(num))
    const sound = sounds[Math.floor(Math.random() * sounds.length)]
    const audio = new Audio(`/assets/${src}/audio/${sound}.mp3`)
    audio.play()
    setLastSounds((prev) => [...prev.slice(1), sound])
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
        {wcount ? <AnimateNumbers children={wcount + currentCount} /> : <span className={styles.count}>—</span>}
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
          <span className={styles.count}>{count}</span>
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
