import "./index.css"
import Layout from "./components/layouts/Layout"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import ToasterProvider from "./providers/ToasterProvider"
import { AuthProvider } from "./context/AuthContext"
import Home from "./page"
import Listing from "./listings"

function App() {
  return (
    <>
      <ToasterProvider />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Layout with NavBar but NO Footer (Login/Register */}
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />}/>
              <Route path="/listings/:id" element={<Listing/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
