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
    <div className={styles.numbers}>
      {String(children)
        .split('')
        .reverse()
        .map((digit, index) => {
          const realIndex = String(children).length - 1 - index
          const isThousandGroup = index !== 0 && index % 3 === 0

          return (
            <div
              key={realIndex}
              className={styles.number}
              style={{
                width: `${widths[digit]}px`,
                marginRight: isThousandGroup ? '16px' : '0px' // или paddingLeft, на вкус
              }}
            >
              <AnimatedDigit digit={Number(digit)} />
            </div>
          )
        })
        .reverse()}
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
    <span className={styles.digit}
      style={{
        width: `${widths[digit]}px`,
        transform: `translateY(-${offset}%)`,
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
