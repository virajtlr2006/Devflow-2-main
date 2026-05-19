import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Signin from './pages/Login'


function App() {
  return (
    <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/login" element={<Signin />} />
          </Routes>
    </BrowserRouter>
  )
}

export default App
