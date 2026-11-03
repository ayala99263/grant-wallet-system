import { useState, useCallback } from 'react';
import axios from 'axios';

// הגדרת כתובת הבסיס של השרת
const BASE_URL = 'http://localhost:5000/api';

export const useResource = (endpoint) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // עטיפת הליבה ב-useCallback כדי לשמור על רפרנס קבוע ולמנוע לולאות אינסופיות
    const request = useCallback(async (method, url = '', payload = null) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await axios({
                method,
                url: `${BASE_URL}${endpoint}${url}`,
                data: payload,
                withCredentials: true // מאפשר שליחת עוגיות/טוקנים מאובטחים
            });
            setData(response.data);
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'אירעה שגיאה בתקשורת עם השרת';
            setError(errorMessage);
            throw err; 
        } finally {
            setIsLoading(false);
        }
    }, [endpoint]); // endpoint נמצא כאן כי הפונקציה תלויה בו

    // פונקציות מעטפת לפעולות CRUD נפוצות
    const getAll = () => request('GET');
    const getById = (id) => request('GET', `/${id}`);
    const create = (payload) => request('POST', '', payload);
    const update = (id, payload) => request('PUT', `/${id}`, payload);
    const remove = (id) => request('DELETE', `/${id}`);

    return { data, error, isLoading, getAll, getById, create, update, remove, request };
};