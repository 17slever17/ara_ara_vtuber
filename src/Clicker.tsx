import { useEffect, useRef, useState } from 'react'
import { usePageVisibility } from 'react-page-visibility'
import axios from 'axios'
import styles from './scss/Clicker.module.scss'
import { Link } from 'react-router-dom'

import ArrowIcon from './assets/arrowIcon.svg?react'

type TClickerProps = { id: number; src: string; name: string; link: string; soundsCount: number }

const Clicker: React.FC<TClickerProps> = ({ id, src, name, link, soundsCount }) => {
  const [count, setCount] = useState(0)
  const [currentCount, setCurrentCount] = useState(0)
  const [time, setTime] = useState(10)
  const [wcount, setWcount] = useState(0)
  const [lastSound, setLastSound] = useState(-1)
  const isPageVisible = usePageVisibility()

  const currentCountRef = useRef(currentCount)

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    currentCountRef.current = currentCount
  }, [currentCount])

  useEffect(() => {
    if (time >= 8 && isPageVisible) {
      setTime(0)
      async function fetchData() {
        try {
          const getResponse = await axios.get(`https://a5e42101e4a687b4.mokky.dev/counter/${id}`)
          const counter = getResponse.data
          if (!counter) {
            console.error('Нет данных для обновления')
            return
          }
          const newCount = counter.count + currentCountRef.current
          setWcount(newCount)
          if (currentCountRef.current !== 0) {
            setCurrentCount(0)
            await axios.patch(`https://a5e42101e4a687b4.mokky.dev/counter/${id}`, {
              count: newCount
            })
          }
        } catch (error) {
          if (error instanceof Error) {
            console.error('Error fetching:', error.message)
          }
        }
      }
      fetchData()
    }
  }, [time, isPageVisible, currentCount])

  const clickAra = () => {
    setCount((prev) => prev + 1)
    setCurrentCount((prev) => prev + 1)
    let sound = Math.floor(Math.random() * soundsCount) + 1
    while (sound === lastSound) {
      sound = Math.floor(Math.random() * soundsCount) + 1
    }
    const audio = new Audio(`/assets/${src}/audio/${sound}.mp3`)
    audio.play()
    setLastSound(sound)
  }

  return (
    <div className={`${styles.container} ${styles[src]}`}>
      <div className={styles.linkWrapper}>
        <Link to='/home' className={`${styles.link} ${styles.linkBtn}`}>
          <div className={`${styles.linkContainer} ${styles.linkContainerAbsolute}`}>
            <ArrowIcon className={styles.arrow} />
            <span className={styles.linkTitle}>Home</span>
          </div>
        </Link>
      </div>
      <div className={styles.worldCounter}>
        <span className={styles.count}>{wcount + currentCount}</span>
        <span className={styles.title}>Global Ara Ara Counter</span>
      </div>
      <div className={styles.myCounter}>
        <img
          className={styles.gif}
          src={`/assets/${src}/${src}.gif`}
          alt='vtuber'
          onClick={() => clickAra()}
        ></img>
        <div className={styles.counter}>
          <span className={styles.title}>Ara Ara Counter: </span>
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
