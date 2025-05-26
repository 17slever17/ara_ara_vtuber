import { Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import data from './data.json'
import SettingsStorageSync from './utils/SettingsStorageSync'

import Clicker from './Clicker'
import Home from './Home'
import Settings from './Settings'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
})

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  )
}

export default App
