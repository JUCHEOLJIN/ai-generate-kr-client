import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import GenerateProblem from './pages/GenerateProblem/GenerateProblem'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GenerateProblem />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
