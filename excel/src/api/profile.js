const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getUserById = async (id) => {
    const res = await fetch(`${API_BASE}/profile/${id}`);
    return await res.json();
};

export const updateUserById = async (id, data) => {
    const res = await fetch(`${API_BASE}/profile/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });
    return await res.json();
};