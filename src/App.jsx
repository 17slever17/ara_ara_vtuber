import { useEffect, useState } from 'react'
import { usePageVisibility } from 'react-page-visibility'
import axios from 'axios'
import './scss/main.scss'

function App() {
  const [count, setCount] = useState(0)
  const [currentCount, setCurrentCount] = useState(0)
  const [time, setTime] = useState(10)
  const [wcount, setWcount] = useState()
  const isPageVisible = usePageVisibility()

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime((prevTime) => prevTime + 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [])

  useEffect(() => {
    if (time >= 10 && isPageVisible) {
      setTime(0)
      async function fetchData() {
        try {
          const getResponse = await axios.get('https://a5e42101e4a687b4.mokky.dev/counter')
          const counter = getResponse.data[0]
          if (!counter) {
            console.error('Нет данных для обновления')
            return
          }

          const newCount = counter.count + currentCount
          const patchResponse = await axios.patch(
            `https://a5e42101e4a687b4.mokky.dev/counter/${counter.id}`,
            { count: newCount }
          )
          setCurrentCount(0)
          console.log(patchResponse.data)
          setWcount(newCount)
        } catch (error) {
          console.error('Error fetching:', error.message)
        }
      }

      fetchData()
    }
  }, [time, isPageVisible, currentCount])

  const clickAra = () => {
    setCount((prev) => prev + 1)
    setCurrentCount((prev) => prev + 1)
    const audio = new Audio(`/assets/audio/${Math.floor(Math.random() * 10) + 1}.mp3`)
    console.log(Math.floor(Math.random() * 10) + 1)
    audio.play()
  }

  return (
    <div className='container'>
      <div className='worldCounter'>
        <span className='count'>{wcount + currentCount}</span>
        <span className='title'>Global Ara Ara Counter</span>
      </div>
      <div className='myCounter'>
        <img className='gif' src='/assets/S02.gif' alt='Shylily' onClick={() => clickAra()}></img>
        <div className='counter'>
          <span className='title'>Ara Ara Counter: </span>
          <span className='count'>{count}</span>
        </div>
      </div>
      <div className='desc'>
        <span className='channel'>
          Subscribe to{' '}
          <a href='https://www.twitch.tv/shylily' target='_blank'>
            Shylily
          </a>
          !
        </span>
        <span className='createdBy'>
          Created by{' '}
          <a href='https://www.youtube.com/@slever17' target='_blank'>
            -SleveR-
          </a>
        </span>
      </div>
    </div>
  )
}

export default App
