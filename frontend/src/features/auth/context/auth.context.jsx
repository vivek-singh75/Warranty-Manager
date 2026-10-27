import { createContext, useEffect, useState } from "react";

import {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser
} from "../api/auth.api";


export const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);


    const handleRegister = async (data) => {
        const response = await registerUser(data);

        return response;
    };


    const handleLogin = async (data) => {
        const response = await loginUser(data);

        setUser(response.user);

        return response;
    };


    const logout = async () => {
        await logoutUser();

        setUser(null);
    };


    const fetchCurrentUser = async () => {

        try {

            const response = await getCurrentUser();

            setUser(response.user);

        } catch (error) {

            setUser(null);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        fetchCurrentUser();
    }, []);


    const value = {
        user,
        loading,
        isAuthenticated: !!user,

        handleRegister,
        handleLogin,
        logout
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};