import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/profile'; // adjust if needed

export const getUserById = async (id) => {
    const res = await axios.get(`${API_BASE}/${id}`);
    return res.data;
};

export const updateUserById = async (id, data) => {
    const res = await axios.put(`${API_BASE}/${id}`, data);
    return res.data;
};
  