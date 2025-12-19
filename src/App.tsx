import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import GenerateProblem from './pages/GenerateProblem/GenerateProblem'
import ImageToText from './pages/ImageToText/ImageToText'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GenerateProblem />} />
        <Route path="/image-to-text" element={<ImageToText />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
