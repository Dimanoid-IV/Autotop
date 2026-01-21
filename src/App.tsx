import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Details from './pages/Details'
import { LanguageProvider } from './context/LanguageContext'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/:city" element={<Home />} />
          <Route path="/service/:id" element={<Details />} />
        </Routes>
      </Router>
    </LanguageProvider>
  )
}

export default App


