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

    const [loading, setLoading] = useState({
        register: false,
        login: false,
        logout: false,
        getCurrentUser: true
    });

    const [error, setError] = useState("");

    const handleRegister = async (data) => {
        setLoading(prev => ({ ...prev, register: true }));
        setError("");

        try {
            const response = await registerUser(data);
            return response;

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            throw error;

        } finally {
            setLoading(prev => ({ ...prev, register: false }));
        }
    };

    const handleLogin = async (data) => {
        setLoading(prev => ({ ...prev, login: true }));
        setError("");

        try {
            const response = await loginUser(data);
            setUser(response.user);
            return response;

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            throw error;

        } finally {
            setLoading(prev => ({ ...prev, login: false }));
        }
    };

    const logout = async () => {
        setLoading(prev => ({ ...prev, logout: true }));
        setError("");

        try {
            await logoutUser();
            setUser(null);

        } catch (error) {
            setError(error.response?.data?.message || error.message);
            throw error;

        } finally {
            setLoading(prev => ({ ...prev, logout: false }));
        }
    };

    const fetchCurrentUser = async () => {
        setLoading(prev => ({ ...prev, getCurrentUser: true }));

        try {
            const response = await getCurrentUser();
            setUser(response.user);

        } catch (error) {
            setUser(null);
            setError(error.response?.data?.message || error.message);

        } finally {
            setLoading(prev => ({ ...prev, getCurrentUser: false }));
        }
    };

    useEffect(() => {
        fetchCurrentUser();
    }, []);

    const value = {
        user,
        loading,
        error,
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