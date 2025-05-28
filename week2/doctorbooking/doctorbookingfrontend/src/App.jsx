import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage"
import AboutPage from "./pages/AboutPage"
import DoctorsPage from "./pages/DoctorsPage"
import ContactPage from "./pages/ContactPage"
import Layout from "./components/layouts/Layout"
import './styles.css'
import AuthProvider from './context/auth/AuthProvider';
import HomePage from './pages/HomePage';
import LayoutWithFooter from './components/layouts/LayoutWithFooter';
import DoctorProfilePage from './pages/DoctorProfilePage';
import MyProfilePage from './pages/MyProfilePage';
import MyAppointments from './pages/MyAppointments';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                  {/* Layout with NavBar but NO Footer (Login/Register */}
                    <Route path="/" element={<Layout />}>
                      <Route path="login" element={<LoginPage />} />
                      <Route path="register" element={<RegisterPage/>} />
                    </Route>

                    {/* Layout with both NavBar + Footer */}
                    <Route path="/" element={<LayoutWithFooter />}>
                      <Route index element={<HomePage />} />
                      <Route path="about" element={<AboutPage />} />
                      <Route path="doctors" element={<DoctorsPage />} />
                      <Route path="doctors/:doctorId" element={<DoctorProfilePage />} />
                      <Route path="contact" element={<ContactPage />} />
                      <Route path="my-profile" element={<MyProfilePage />} />
                      <Route path="my-appointments" element={<MyAppointments/>} />
                    </Route> 
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;





