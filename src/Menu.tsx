import styles from './scss/Menu.module.scss'

const Menu: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  const cardBlock = (items: number[]) => {
    return items.map((id) => (
      <div className={styles.card} key={id}>
        <div className={styles.lock}></div>
        <div className={styles.locked}></div>
        <div className={styles.image}></div>
      </div>
    ))
  }
  return (
    <div className={`${styles.wrapperMenu} ${isOpen ? styles.openedMenu : ''}`}>
      <div className={`${styles.settingsMenu}`}>
        <div className={styles.selectSection}>
          <span className={styles.title}>Background pattern:</span>
          <div className={styles.wrapper}>{cardBlock([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])}</div>
        </div>
        <div className={styles.selectSection}>
          <span className={styles.title}>Falling particles:</span>
          <div className={styles.wrapper}>{cardBlock([1, 2, 3])}</div>
        </div>
        <div className={styles.selectSection}>
          <span className={styles.title}>Click particles:</span>
          <div className={styles.wrapper}>{cardBlock([1, 2, 3, 4, 5, 6])}</div>
        </div>
      </div>
    </div>
  )
}

export default Menu
