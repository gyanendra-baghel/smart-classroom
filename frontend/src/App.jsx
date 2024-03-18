import { BrowserRouter,  Routes, Route} from "react-router-dom"
import Home from "./pages/Home"
import Quiz from "./pages/Quiz"
import Chat from "./pages/Chat"
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/quiz" element={<Quiz/>} />
      <Route path="/ai" element={<Chat/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
