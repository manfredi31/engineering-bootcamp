import { Outlet } from "react-router-dom";
import NavBar from "../navbar/NavBar";
import Footer from "../footer/Footer"; 

export default function LayoutWithFooter() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-1 max-w-7xl mx-auto p-5 w-full">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}