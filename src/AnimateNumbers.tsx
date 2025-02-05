import { useEffect, useState } from 'react'
import styles from './scss/AnimateNumbers.module.scss'

type TAnimateNumberProps = {
  children: number
}

type TAnimatedDigitProps = {
  digit: number
}

const widths: { [key: string]: string } = {
  '0': '28.68',
  '1': '23.24',
  '2': '29.95',
  '3': '28.68',
  '4': '24',
  '5': '27.08',
  '6': '25.55',
  '7': '31.68',
  '8': '27.72',
  '9': '23.49'
}

const AnimateNumbers: React.FC<TAnimateNumberProps> = ({ children }) => {
  const [prevChildren, setPrevChildren] = useState(children)

  useEffect(() => {
    if (children !== prevChildren) {
      setPrevChildren(children)
    }
  }, [children, prevChildren])

  return (
    <div className={styles.numbers} style={{ display: 'inline-flex', height: 87, overflow: 'hidden' }}>
      {String(children)
        .split('')
        .map((digit, index) => (
          <div
            key={index}
            style={{
              display: 'inline-flex',
              flexDirection: 'column',
              position: 'relative',
              width: `${widths[digit]}px`,
							transition: 'all 0.5s'
            }}
          >
            <AnimatedDigit digit={Number(digit)} />
          </div>
        ))}
    </div>
  )
}

const AnimatedDigit: React.FC<TAnimatedDigitProps> = ({ digit }) => {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const newOffset = digit * 10
    requestAnimationFrame(() => {
      setOffset(newOffset)
    })
  }, [digit])

  return (
    <span
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
				width: `${widths[digit]}px`,
        position: 'absolute',
        transform: `translateY(-${offset}%)`,
        transition: 'all 0.5s'
      }}
    >
      {Array.from({ length: 10 }, (_, idx) => (
        <span className={styles.count} key={idx}>
          {idx}
        </span>
      ))}
    </span>
  )
}

export default AnimateNumbers
