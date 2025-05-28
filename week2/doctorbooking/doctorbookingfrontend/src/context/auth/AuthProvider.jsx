import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from './AuthContext';

export default function AuthProvider ({ children }) {
    // State to track authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    
    const navigate = useNavigate();

    // Check localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedUserId = localStorage.getItem('userId');
        const storedUserRole = localStorage.getItem('userRole');

        if (storedToken && storedUserId && storedUserRole) {
            setToken(storedToken);
            setUserId(storedUserId);
            setUserRole(storedUserRole);
            setIsAuthenticated(true);
        }
    }, []);

    // Auth methods
    const login = (newToken, newUserId, newUserRole) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userId', newUserId);
        localStorage.setItem('userRole', newUserRole);
        
        setToken(newToken);
        setUserId(newUserId);
        setUserRole(newUserRole);
        setIsAuthenticated(true);
        navigate('/');  // Redirect to home page
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole');
        
        setToken(null);
        setUserId(null);
        setUserRole(null);
        setIsAuthenticated(false);
        navigate('/login');  // Redirect to login page
    };

    // Value object that will be provided to consumers
    const value = {
        isAuthenticated,
        token,
        userId,
        userRole,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
