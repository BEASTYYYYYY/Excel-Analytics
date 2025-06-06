import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getUserById = async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
};

export const updateUserById = async (id, data) => {
    const res = await axios.put(`${API_BASE}/${id}`, data);
    return res.data;
};
  