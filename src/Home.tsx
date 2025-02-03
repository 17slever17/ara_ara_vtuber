import Card from './Card'
import styles from './scss/Home.module.scss'

type THomeProps = {
  data: { cardName: string; src: string }[]
}

const Home: React.FC<THomeProps> = ({ data }) => {
  return (
    <div>
      <div className={styles.container}>
        <span className={styles.title}>Choice of sounds</span>
        <div className={styles.cards}>
          {data.map((vtuber, id) => (
            <Card
              key={id}
              link={`/${vtuber.src}`}
              imgUrl={`assets/${vtuber.src}/${vtuber.src}.jpg`}
              title={`— ${vtuber.cardName} —`}
            />
          ))}
        </div>
      </div>
      <footer className={styles.footer}>
        <span>
          Created by{' '}
          <a href='https://www.youtube.com/@slever17' target='_blank'>
            -SleveR-
          </a>
        </span>
        <span>
          Mostly gifs from{' '}
          <a href='https://www.youtube.com/@CuteCafe' target='_blank'>
            CuteCafe
          </a>
        </span>
      </footer>
    </div>
  )
}
export default Home
