import { Route, Routes } from 'react-router-dom'
import data from './data.json'
import Clicker from './Clicker'
import Home from './Home'
import Settings from './Settings'
import SettingsStorageSync from './utils/SettingsStorageSync'

const App: React.FC = () => {
  return (
    <>
      <SettingsStorageSync />
      <Settings />
      <Routes>
        <Route path='/' element={<Home data={data} />}></Route>
        <Route path='/home' element={<Home data={data} />}></Route>
        {data.map((vtuber, id) => (
          <Route
            key={id}
            path={`/${vtuber.src}`}
            element={
              <Clicker
                id={vtuber.id}
                src={vtuber.src}
                name={vtuber.name}
                link={vtuber.link}
                sound={vtuber.sound}
                soundsCount={vtuber.soundsCount}
              />
            }
          ></Route>
        ))}
      </Routes>
    </>
  )
}

export default App
