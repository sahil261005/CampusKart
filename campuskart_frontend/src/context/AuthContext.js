
import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

// 1. Create the Context
// This is like a global "Data Store" that any component can access.
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // 2. State Management
    // 'user': Stores the logged-in user's info (email, name, etc.)
    // 'loading': Prevents the app from showing "Login" page while we check if user is already logged in.
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 3. Check Login Status on App Start
    // useEffect runs once when the app loads.
    useEffect(() => {
        checkUserLoggedIn();
    }, []);

    const checkUserLoggedIn = async () => {
        // Look for the 'Token' in the browser's storage.
        // JWT (JSON Web Token) is like a digital ID card.
        const token = localStorage.getItem('access_token');
        
        if (token) {
            try {
                // Verify the token by asking the backend "Who is this?"
                const res = await api.get('profile/');
                setUser(res.data); // Success! Valid user.
            } catch (error) {
                console.error("Auth check failed:", error);
                // Token expired or invalid? Logout.
                localStorage.clear();
                setUser(null);
            }
        }
        setLoading(false); // Done checking.
    };

    // 4. Login Function
    const login = async (email, password) => {
        // Send credentials to backend
        const res = await api.post('token/', { email, password });
        
        // Save the Tokens securely
        localStorage.setItem('access_token', res.data.access);
        localStorage.setItem('refresh_token', res.data.refresh);
        
        // Fetch user details immediately
        await checkUserLoggedIn();
        return true;
    };

    // 5. Register Function
    const register = async (userData) => {
        // userData can be JSON or FormData (if uploading profile pic)
        const config = {
            headers: userData instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {}
        };
        const res = await api.post('register/', userData, config);
        return res.data;
    };

    // 6. Logout Function
    const logout = () => {
        // Destroy the digital ID card (Token)
        localStorage.clear();
        setUser(null);
        // Force redirect to login
        window.location.href = '/login';
    };

    // 7. Provide this data to the whole app
    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
