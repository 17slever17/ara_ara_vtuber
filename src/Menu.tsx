import styles from './scss/Menu.module.scss'

const Menu: React.FC<{ isOpen: boolean }> = ({ isOpen }) => {
  return (
    <div className={`${styles.wrapperMenu} ${isOpen ? styles.openedMenu : ''}`}>
      <div className={`${styles.settingsMenu}`}>
        <div className={styles.selectSection}>
          <span className={styles.title}>Background pattern:</span>
          <div className={styles.wrapper}>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
          </div>
        </div>
        <div className={styles.selectSection}>
          <span className={styles.title}>Falling particles:</span>
          <div className={styles.wrapper}>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
          </div>
        </div>
        <div className={styles.selectSection}>
          <span className={styles.title}>Click particles:</span>
          <div className={styles.wrapper}>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
            <div className={styles.card}></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu
