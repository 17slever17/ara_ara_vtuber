import { useEffect, useRef, useState } from 'react'
import { usePageVisibility } from 'react-page-visibility'
import AnimateNumbers from './AnimateNumbers'
import axios from 'axios'

import styles from './scss/Clicker.module.scss'
import { Link } from 'react-router-dom'

import ArrowIcon from './assets/arrowIcon.svg?react'

type TClickerProps = {
  id: number
  src: string
  name: string
  link: string
  sound: string
  soundsCount: number
}

const Clicker: React.FC<TClickerProps> = ({ id, src, name, link, sound, soundsCount }) => {
  const [count, setCount] = useState(0)
  const [currentCount, setCurrentCount] = useState(0)
  const [time, setTime] = useState(10)
  const [wcount, setWcount] = useState(0)
  const [lastSound, setLastSound] = useState(-1)
  const [last2Sound, setLast2Sound] = useState(-1)
  const isPageVisible = usePageVisibility()

  const currentCountRef = useRef(currentCount)

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
    if ((time >= 8 && isPageVisible) || (time >= 8 && currentCount !== 0)) {
      setTime(0)
      fetchData()
    }
  }, [time, isPageVisible, currentCount])

  async function fetchData() {
		try {
			const getResponse = await axios.get('/api/mokky-proxy', {
				params: { path: `counter/${id}` }
			});
	
			const counter = getResponse.data;
			console.log(counter)
			if (!counter) {
				console.error('Нет данных для обновления');
				return;
			}
	
			const newCount = counter.count + currentCountRef.current;
			setWcount(newCount);
	
			if (newCount !== wcount) {
				if (currentCountRef.current !== 0) {
					setCurrentCount(0);
					await axios.patch('/api/mokky-proxy', 
						{ count: newCount }, // тело запроса
						{ params: { path: `counter/${id}` } } // конфигурация, где параметры запроса передаются корректно
					);
				}
			}
		} catch (error) {
			console.error('Ошибка:', error);
		}
	}

  const clickAra = () => {
    setCount((prev) => prev + 1)
    setCurrentCount((prev) => prev + 1)
    let sound = Math.floor(Math.random() * soundsCount) + 1
    while (sound === lastSound || sound === last2Sound) {
      sound = Math.floor(Math.random() * soundsCount) + 1
    }
    const audio = new Audio(`/assets/${src}/audio/${sound}.mp3`)
    audio.play()
    setLast2Sound(lastSound)
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
        {wcount ? (
          <AnimateNumbers children={wcount + currentCount} />
        ) : (
          <span className={styles.count}>—</span>
        )}
        <span className={styles.title}>Global {sound} Counter</span>
      </div>
      <div className={styles.myCounter}>
        <img
          className={styles.gif}
          src={`/assets/${src}/${src}.gif`}
          alt='vtuber'
          draggable='false'
          onClick={() => clickAra()}
        ></img>
        <div className={styles.counter}>
          <span className={styles.title}>{sound} Counter: </span>
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
