import { Outlet } from 'react-router-dom'
import NavBar from '../navbar/NavBar'

export default function Layout () {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar/>
            <main className="flex-1 max-w-7xl mx-auto p-5 w-full">
                <Outlet />
            </main>
        </div>
    )
}