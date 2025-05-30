import "./index.css"
import Layout from "./components/layouts/Layout"

import { BrowserRouter, Routes, Route } from "react-router-dom"
import ToasterProvider from "./providers/ToasterProvider"
import { AuthProvider } from "./context/AuthContext"

function App() {
  return (
    <>
      <ToasterProvider />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Layout with NavBar but NO Footer (Login/Register */}
            <Route path="/" element={<Layout />}>
              <Route />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
