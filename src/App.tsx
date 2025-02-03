import { Route, Routes } from 'react-router-dom'
import Clicker from './Clicker'
import Home from './Home'
import data from './data.json'

const App: React.FC = () => {
  return (
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
  )
}

export default App
