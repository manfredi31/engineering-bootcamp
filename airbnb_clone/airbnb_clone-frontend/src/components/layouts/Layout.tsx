import { Outlet } from 'react-router-dom'
import NavBar from '../navbar/NavBar'
import RegisterModal from '../modals/RegisterModal'
import LoginModal from '../modals/LoginModal'
import RentModal from '../modals/RentModal'

export default function Layout () {
    return (
        <div className="flex min-h-screen flex-col">
            <LoginModal />
            <RentModal />
            <RegisterModal/>
            <NavBar/>
            <main className="flex-1">
                <div className='pb-20 pt-28'>
                    <Outlet />
                </div>
                
            </main>

        </div>
    )
}