import { Link } from "react-router-dom"
import logo from "../../assets/logo.svg";
import ProfileDropdown from './ProfileDropdown';
import CreateAccountButton from './CreateAccountButton';
import { useAuth } from '../../context/auth/AuthContext';

const NavBar = () => {
    const { isAuthenticated } = useAuth();

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2">
                            <img className="h-12 w-auto" src={logo} alt="Prescripto" />
                            <span className="text-xl font-bold text-indigo-600">Prescripto</span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                            HOME
                        </Link>
                        <Link to="/doctors" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                            ALL DOCTORS
                        </Link>
                        <Link to="/about" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                            ABOUT
                        </Link>
                        <Link to="/contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2 text-sm font-medium">
                            CONTACT
                        </Link>
                    </div>

                    {/* Auth Section */}
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? <ProfileDropdown /> : <CreateAccountButton />}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;