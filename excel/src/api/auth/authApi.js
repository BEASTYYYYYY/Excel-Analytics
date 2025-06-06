
import axios from 'axios';

// Optional: use a custom axios instance
// import axios from '../../utils/axiosInstance';

export const loginUser = async (userData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, userData);
    return response.data;
};

export const registerUser = async (userData) => {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/register`, userData);
    return response.data;
};
