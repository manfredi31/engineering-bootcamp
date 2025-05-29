import "./index.css"
import Layout from "./components/layouts/Layout"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import ToasterProvider from "./providers/ToasterProvider"

function App() {
  return (
    <>
      <ToasterProvider />
      <BrowserRouter> 
        <Routes>
          {/* Layout with NavBar but NO Footer (Login/Register */}
          <Route path="/" element={<Layout />}>
              <Route />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
