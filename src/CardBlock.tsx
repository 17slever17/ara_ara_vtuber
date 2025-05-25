import styles from './scss/Menu.module.scss'
import themes from './scss/themes.module.scss'
import LockIcon from './assets/lock.svg?react'
import React from 'react'
import { useAppSelector } from './hooks'
import { selectSettings } from './redux/slices/settingsSlice'
import goalsJson from './goals.json'
import { calcTotalCount } from './utils/calcTotalCount'

type GoalsType = {
  local: Record<string, number>
  global: {
    backgrounds: Record<string, number>
    fallings: Record<string, number>
  }
}

export const goals: GoalsType = goalsJson

type CardBlockProps = {
  items: number[]
  src: string
  title: string
  onSelect: (id: number) => void
}

const CardBlock: React.FC<CardBlockProps> = ({ items, src, title, onSelect }: CardBlockProps) => {
  const { page, name, backgroundPattern, fallingParticles, clickParticles, clickCount } = useAppSelector(selectSettings)
  const pattern = (id: number) => {
    if (src === 'backgrounds') return id === backgroundPattern ? styles.selectedCard : ''
    if (src === 'fallings') return id === fallingParticles ? styles.selectedCard : ''
    if (src === 'emotes') return clickParticles[page].includes(id) ? styles.selectedCard : ''
  }
  const goal = (id: string) => {
    if (src === 'backgrounds') return goals.global.backgrounds[id]
    if (src === 'fallings') return goals.global.fallings[id]
    if (src === 'emotes') return goals.local[id]
    return 0
  }
  const goalCount = (id: number) => {
    const num = goal(id.toString())
    if (num < 1000) return num.toString()
    const n = Math.floor(Math.log10(num) / 3)
    return (num / 10 ** (n * 3)).toFixed(1).replace(/\.0$/, '') + 'k'.repeat(n)
  }
  const goalReached = (id: number) => {
    if (src === 'backgrounds' || src === 'fallings') return calcTotalCount(clickCount) <= goal(id.toString())
    if (src === 'emotes') return clickCount[page] <= goal(id.toString())
    return 0
  }

  if (src === 'emotes' && page === 'home') return <></>
  return (
    <div className={styles.selectSection}>
      <span className={styles.title}>{title}:</span>
      <div className={styles.wrapper}>
        {items.map((id) => (
          <div
            className={`${styles.card} ${themes[`${page}-card`]} ${pattern(id)}`}
            key={id}
            onClick={() => onSelect(id)}
          >
            {goalReached(id) && (
              <>
                <div className={styles.lockContainer}>
                  <LockIcon className={styles.lock} />
                  <span className={styles.goal}>{goalCount(id)}</span>
                </div>
                <div className={styles.locked} />
              </>
            )}
            <img
              className={styles.img}
              src={`/assets/${src}/${src === 'emotes' ? name + '/' : ''}${id}.${src === 'emotes' ? 'png' : 'svg'}`}
              alt='vtuber'
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardBlock
