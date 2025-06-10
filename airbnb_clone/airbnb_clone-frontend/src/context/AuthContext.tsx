import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import useCurrentUser from "../hooks/useCurrentUser";

export interface User {
    id: string;  // Changed from number to string as it's a UUID in the backend
    email: string | null;  // Can be null as it's nullable in the backend
    name: string | null;  // Can be null as it's nullable in the backend
    emailVerified: string | null;  // ISO date string or null
    image: string | null;  // Can be null as it's nullable in the backend
    createdAt: string;  // ISO date string
    updatedAt: string;  // ISO date string
    favoriteIds: string[] | null;  // Can be null as it's nullable in the backend
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { data: user, isLoading } = useCurrentUser();

    return (
        <AuthContext.Provider value={{user, isLoading, isLoggedIn: !!user}}>
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

