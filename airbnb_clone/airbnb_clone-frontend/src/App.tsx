import "./index.css"
import Layout from "./components/layouts/Layout"

import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {


  return (
    <BrowserRouter> 
      <Routes>
        {/* Layout with NavBar but NO Footer (Login/Register */}
        <Route path="/" element={<Layout />}>
            <Route />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
