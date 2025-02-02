import "./App.css"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { SlotMachine } from "./components/SlotMachine"

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <button>Register</button>
        <button>Login</button>
      </nav>
      <Routes>
        <Route path="/" element={<SlotMachine />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
