import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk for creating a user (handles FormData)
export const createUser = createAsyncThunk(
  'user/createUser',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/user/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // This header is important for file uploads
        },
      });
      return response.data; // Assuming backend response includes 'data'
    } catch (error) {
      return rejectWithValue(error.response.data); // Error handling
    }
  }
);

// Async thunk for fetching the user profile
export const fetchUserProfile = createAsyncThunk(
  'user/fetchUserProfile',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get('http://localhost:8000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`, // Pass the token for authentication
        },
      });
      return response.data; // Return the profile data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

// Async thunk for updating the user profile
export const updateUserProfile = createAsyncThunk(
  'user/updateUserProfile',
  async ({ updatedData, token }, { rejectWithValue }) => {
    try {
      const response = await axios.put('http://localhost:8000/api/user/profile', updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Ensure the correct content type for file uploads
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the updated profile data
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);

// Async thunk for deleting the user profile
export const deleteUserProfile = createAsyncThunk(
  'user/deleteUserProfile',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.delete('http://localhost:8000/api/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data; // Return the success message after deletion
    } catch (error) {
      return rejectWithValue(error.response.data); // Return error message
    }
  }
);



// Create slice for user state
const userSlice = createSlice({
  name: 'user',
  initialState: { userInfo: null, error: null, loading: false },
  reducers: {
    // Reset user information
    resetUser: (state) => {
      state.userInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createUser actions
      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.userInfo = action.payload.data || action.payload; // Ensure correct response structure
        state.loading = false;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to create user'; // Set error message
        state.loading = false;
      })

      // Handle updateUser actions
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to fetch profile';
        state.loading = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload.data; // Update user info
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to update profile';
        state.loading = false;
      })
      .addCase(deleteUserProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserProfile.fulfilled, (state) => {
        state.userInfo = null; // Clear user info on deletion
        state.loading = false;
      })
      .addCase(deleteUserProfile.rejected, (state, action) => {
        state.error = action.payload?.message || 'Failed to delete profile';
        state.loading = false;
      });
  },
});

// Export actions and reducer
export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
