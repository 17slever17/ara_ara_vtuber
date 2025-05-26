import Card from './Card'
import styles from './scss/Home.module.scss'
import { useAppDispatch } from './hooks/hooks'
import { setSlug } from './redux/slices/settingsSlice'
import { useEffect } from 'react'

type THomeProps = {
  data: { cardName: string; slug: string }[]
}

const Home: React.FC<THomeProps> = ({ data }) => {
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(setSlug('home'))
  }, [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <span className={styles.title}>Choice of sounds</span>
        <div className={styles.cards}>
          {data.map((vtuber, id) => (
            <Card
              key={id}
              link={`/${vtuber.slug}`}
              imgUrl={`assets/${vtuber.slug}/${vtuber.slug}.jpg`}
              title={`— ${vtuber.cardName} —`}
            />
          ))}
        </div>
      </div>
      <footer className={styles.footer}>
        <span className={styles.link1}>
          Suggestions and errors:{' '}
          <a href='https://forms.gle/DwwvxLLsWMk7Wv3N6' target='_blank'>
            Google Form
          </a>
        </span>
        <span className={styles.link2}>
          Created by{' '}
          <a href='https://www.youtube.com/@slever17' target='_blank'>
            -SleveR-
          </a>
        </span>
        <span className={styles.link3}>Support: b; d</span>
      </footer>
    </div>
  )
}
export default Home
