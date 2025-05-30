import { Outlet } from 'react-router-dom'
import NavBar from '../navbar/NavBar'
import RegisterModal from '../modals/RegisterModal'
import LoginModal from '../modals/LoginModal'

export default function Layout () {
    return (
        <div className="min-h-screen flex flex-col">
            <LoginModal />
            <RegisterModal/>
            <NavBar/>
            <main className="flex-1 max-w-7xl mx-auto p-5 w-full">
                <Outlet />
            </main>
        </div>
    )
}