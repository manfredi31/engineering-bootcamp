import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import useCurrentUser from "../hooks/useCurrentUser";

interface User {
    id: number;
    email: string;
    // Add other user properties as needed
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { data: user, isLoading } = useCurrentUser();

    return (
        <AuthContext.Provider value={{user, isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}