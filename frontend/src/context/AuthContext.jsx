import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserFromLocalStorage = () => {
            try {
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    api.defaults.headers.common['Authorization'] = `Bearer ${userData.token}`;
                }
            } catch (error) {
                console.error("Failed to parse user from localStorage", error);
                localStorage.removeItem('user');
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUserFromLocalStorage();
    }, []); 

    const login = async (username, password) => {
        try {
            const { data } = await api.post('/auth/login', { username, password });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            toast.success('Logged in successfully!');
            return data;
        } catch (error) {
            console.error('Login error', error.response?.data);
            toast.error(error.response?.data?.message || 'Login failed');
            throw error;
        }
    };

    const register = async (username, password, role) => {
        try {
            const { data } = await api.post('/auth/register', { username, password, role });
            localStorage.setItem('user', JSON.stringify(data));
            setUser(data);
            api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
            toast.success('Registered successfully!');
            return data;
        } catch (error) {
            console.error('Registration error', error.response?.data);
            toast.error(error.response?.data?.message || 'Registration failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        delete api.defaults.headers.common['Authorization'];
        toast.success('Logged out successfully.');
    };

    const contextValue = {
        user,
        loading,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};