import { createContext, useContext } from 'react';

// Create the context with a default value
const AuthContext = createContext({
    // Auth state
    isAuthenticated: false,
    token: null,
    userId: null,
    userRole: null,
    
    // Auth methods (these will be implemented in the provider)
    login: (token, userId, userRole) => {},
    logout: () => {},
});

// Custom hook to use the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    
    return context;
};

export default AuthContext; 