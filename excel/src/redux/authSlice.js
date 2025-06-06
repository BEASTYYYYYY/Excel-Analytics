import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAuth } from "firebase/auth";
import axios from 'axios';

// ✅ Login thunk
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        // Fetch user profile from backend after login to get role
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, userData);
        // Now fetch the profile (which includes role)
        const profileRes = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/profile`, {
            headers: {
                Authorization: `Bearer ${res.data.token || res.data.accessToken}`
            }
        });
        const auth = getAuth();
        const firebaseUser = auth.currentUser;
        return {
            ...res.data,
            ...profileRes.data.user, // merge backend user (with role) into Redux user
            displayName: firebaseUser?.displayName || profileRes.data.user?.name || "",
            photoURL: firebaseUser?.photoURL || profileRes.data.user?.photo || "",
        };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
});
// ✅ Register thunk
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/login`, userData);
        const auth = getAuth();
        const firebaseUser = auth.currentUser;

        return {
            ...res.data,
            displayName: firebaseUser?.displayName || "",
            photoURL: firebaseUser?.photoURL || ""
        };
    } catch (err) {
        return thunkAPI.rejectWithValue(err.response?.data?.message || 'Register failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        loading: false,
        error: null,
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            localStorage.setItem('user', JSON.stringify(action.payload));
        },
        logout: (state) => {
            state.user = null;
            localStorage.removeItem('user');
        },
        updateUserName: (state, action) => {
            if (state.user) {
                state.user.displayName = action.payload;
                const updatedUser = { ...state.user, displayName: action.payload };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        },
        updateUserPhoto: (state, action) => {
            if (state.user) {
                state.user.photoURL = action.payload;
                const updatedUser = { ...state.user, photoURL: action.payload };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        },
        updateUserRole: (state, action) => {
            if (state.user) {
                state.user.role = action.payload;
                const updatedUser = { ...state.user, role: action.payload };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                localStorage.setItem('user', JSON.stringify(action.payload));
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { logout, setUser, updateUserName, updateUserPhoto } = authSlice.actions;

export default authSlice.reducer;
