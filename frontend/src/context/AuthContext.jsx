import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(localStorage.getItem('username') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access_token'));

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('username');
        setUser(null);
        setIsAuthenticated(false);
        window.location.href = '/auth';
    }, []);

    // Inactivity Logout (5 Minutes)
    useEffect(() => {
        let timeout;
        const resetTimer = () => {
            if (timeout) clearTimeout(timeout);
            if (isAuthenticated) {
                timeout = setTimeout(logout, 300000); // 5 minutes
            }
        };

        const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        events.forEach(event => window.addEventListener(event, resetTimer));

        resetTimer();

        return () => {
            if (timeout) clearTimeout(timeout);
            events.forEach(event => window.removeEventListener(event, resetTimer));
        };
    }, [isAuthenticated, logout]);

    const login = (userData, token) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('username', userData.username);
        setUser(userData.username);
        setIsAuthenticated(true);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
