import { Link } from 'react-router-dom'
import styles from './scss/Card.module.scss'

type TCardProps = {
  link: string
  imgUrl: string
  title: string
}

const Card: React.FC<TCardProps> = ({ link, imgUrl, title }) => {
  return (
    <Link to={link} className={styles.container}>
      <div className={styles.img}>
        <img src={imgUrl} alt='asd' />
      </div>
      <span className={styles.title}>{title}</span>
    </Link>
  )
}

export default Card
