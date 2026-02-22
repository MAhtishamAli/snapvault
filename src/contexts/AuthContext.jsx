import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('sv_token') || null);
    const [isLoading, setIsLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [authModalView, setAuthModalView] = useState('login'); // 'login', 'signup', 'forgot', 'reset'

    useEffect(() => {
        if (token) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            localStorage.setItem('sv_token', token);
            fetchUser();
        } else {
            delete axios.defaults.headers.common['Authorization'];
            localStorage.removeItem('sv_token');
            setUser(null);
            setIsLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            const res = await axios.get(`${API_URL}/auth/me`);
            setUser(res.data.user);
        } catch (err) {
            console.error('Failed to fetch user', err);
            setToken(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        const res = await axios.post(`${API_URL}/auth/login`, { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
    };

    const signup = async (name, email, password) => {
        const res = await axios.post(`${API_URL}/auth/signup`, { name, email, password });
        setToken(res.data.token);
        setUser(res.data.user);
    };

    const logout = () => {
        setToken(null);
    };

    const requireAuthAction = (action) => {
        if (user) {
            action();
        } else {
            setAuthModalView('login');
            setShowAuthModal(true);
        }
    };

    const value = {
        user,
        token,
        isLoading,
        login,
        signup,
        logout,
        showAuthModal,
        setShowAuthModal,
        authModalView,
        setAuthModalView,
        requireAuthAction
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
