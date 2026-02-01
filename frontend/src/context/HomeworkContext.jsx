import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

export const HomeworkContext  = createContext(null);

export const HomeworkContextProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    const [allHomeworks, setAllHomeworks] = useState([]);
    const [homeworksLoading, setHomeworksLoading] = useState(true);
    const [selectedHomeworkStatus, setSelectedHomeworkStatus] = useState(null);

    const fetchAllHomeworks = async () => {
        if (authLoading || !user) {
            setAllHomeworks([]);
            setHomeworksLoading(false);
            return;
        }
        setHomeworksLoading(true);
        try {
            const response = await api.get('/homework');
            if (response.data) {
                setAllHomeworks(response.data);
            }
        } catch (err) {
            console.error("Error fetching all homeworks:", err);
            toast.error("Failed to load homework assignments.");
        } finally {
            setHomeworksLoading(false);
        }
    };

    const completeHomework = async (homeworkId) => {
        if (!user || user.role !== 'student') {
            toast.error("Only students can complete homework.");
            return false;
        }
        try {
            const response = await api.put(`/homework/${homeworkId}/complete`);
            if (response.data) {
                setAllHomeworks(prev =>
                    prev.map(hw => (hw._id === homeworkId ? response.data : hw))
                );
                toast.success("Homework marked as complete!");
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error completing homework:", err);
            toast.error(err.response?.data?.message || "Failed to mark homework as complete.");
            return false;
        }
    };

    const getHomeworkCompletionStatus = async (homeworkId) => {
        if (!user || user.role !== 'faculty') {
            toast.error("Only faculty can view completion status.");
            return;
        }
        try {
            const response = await api.get(`/homework/${homeworkId}/status`);
            if (response.data) {
                setSelectedHomeworkStatus(response.data);
            }
        } catch (err) {
            console.error("Error fetching completion status:", err);
            toast.error("Failed to fetch homework completion status.");
            setSelectedHomeworkStatus(null);
        }
    };

    const createHomework = async (formData) => {
        if (!user || user.role !== 'faculty') {
            toast.error("Only faculty can post homework.");
            return false;
        }
        try {
            const response = await api.post('/homework', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
            });
            
            if (response.data) {
                setAllHomeworks(prev => [response.data, ...prev]);
                toast.success("Homework posted successfully!");
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error creating homework:", err);
            toast.error(err.response?.data?.message || "Failed to post homework.");
            return false;
        }
    };

    const addComment = async (homeworkId, text) => {
        if (!user) {
            toast.error("You must be logged in to comment.");
            return false;
        }
        try {
            const response = await api.post(`/homework/${homeworkId}/comment`, { text });
            
            if (response.data) {
                setAllHomeworks(prev =>
                    prev.map(hw => (hw._id === homeworkId ? response.data : hw))
                );
                toast.success("Comment added!");
                return true;
            }
            return false;
        } catch (err) {
            console.error("Error adding comment:", err);
            toast.error(err.response?.data?.message || "Failed to add comment.");
            return false;
        }
    };

    useEffect(() => {
        fetchAllHomeworks();
    }, [user, authLoading]);

    const contextValue = {
        allHomeworks,
        homeworksLoading,
        selectedHomeworkStatus,
        setSelectedHomeworkStatus,
        fetchAllHomeworks,
        completeHomework,
        getHomeworkCompletionStatus,
        createHomework,
        addComment
    };

    return (
        <HomeworkContext.Provider value={contextValue}>
            {children}
        </HomeworkContext.Provider>
    );
};

export const useHomework = () => {
    const context = useContext(HomeworkContext);
    if (context === null) {
        throw new Error('useHomework must be used within a HomeworkContextProvider');
    }
    return context;
};