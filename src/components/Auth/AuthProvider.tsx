import React, { createContext, ReactElement, useContext } from 'react';
import { useStore } from '../../store/zustandStore';

// Define the type for the context value
interface AuthContextValue {
    UserToken: string | null;
    logIn: (token: string) => void;
    logOut: () => void;
}

// Create the context with an explicit type and no default value
const Auth = createContext<AuthContextValue | null>(null);

// AuthProvider component
const AuthProvider = ({ children }: { children: ReactElement }) => {
    const UserToken = useStore((store) => store.UserToken);
    const setUserToken = useStore((store) => store.setUserToken);

    const logIn = (token: string) => {
        setUserToken(token);
    };

    const logOut = () => {
        setUserToken(null);
    };

    // Define the context value
    const value: AuthContextValue = {
        UserToken,
        logIn,
        logOut,
    };

    return <Auth.Provider value={value}>{children}</Auth.Provider>;
};

// Custom hook to consume the Auth context
export const useAuth = () => {
    const context = useContext(Auth);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthProvider;
