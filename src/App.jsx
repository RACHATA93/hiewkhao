import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/AppShell'
import { AppProvider } from './context/AppContext'
import Favorites from './screens/Favorites/Favorites'
import Home from './screens/Home/Home'
import MapScreen from './screens/Map/MapScreen'
import Random from './screens/Random/Random'
import Settings from './screens/Settings/Settings'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route index element={<Home />} />
            <Route path="map" element={<MapScreen />} />
            <Route path="random" element={<Random />} />
            <Route path="favorites" element={<Favorites />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
