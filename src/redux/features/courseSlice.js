import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch courses from the API
export const fetchCourses = createAsyncThunk('course/fetchCourses', async (_, { getState }) => {
  const state = getState();  // Get the Redux state
  const token = state.auth.token;  // Access the token from the auth slice

  const response = await axios.get('http://localhost:8000/api/course', {
    headers: {
      Authorization: `Bearer ${token}`, // Attach JWT token from Redux store
    },
  });
  return response.data; // Return the data which will be used in the reducer
});

// Add a new course to the API
export const addCourse = createAsyncThunk('course/addCourse', async (courseData, { getState }) => {
  const state = getState();  // Get the Redux state
  const token = state.auth.token;  // Access the token from the auth slice

  const response = await axios.post('http://localhost:8000/api/course/create', courseData, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach JWT token from Redux store
    },
  });
  return response.data; // Return the data which will be used in the reducer
});

// Update an existing course
export const updateCourse = createAsyncThunk('course/updateCourse', async ({ courseId, courseData }, { getState }) => {
  const state = getState();  // Get the Redux state
  const token = state.auth.token;  // Access the token from the auth slice

  const response = await axios.put(`http://localhost:8000/api/course/${courseId}`, courseData, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach JWT token from Redux store
    },
  });
  return response.data; // Return the updated course data
});

// Delete a course from the API
export const deleteCourse = createAsyncThunk('course/deleteCourse', async (courseId, { getState }) => {
  const state = getState();  // Get the Redux state
  const token = state.auth.token;  // Access the token from the auth slice

  await axios.delete(`http://localhost:8000/api/course/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`, // Attach JWT token from Redux store
    },
  });
  return courseId; // Return the ID of the deleted course to remove it from the state
});

// Redux slice to manage course state
const courseSlice = createSlice({
  name: 'courses',
  initialState: {
    courses: [],  // Store the fetched courses here
    loading: false,  // Loading state for fetching courses
    error: null,  // To store any error that may occur during the async operations
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload; // Store fetched courses
        state.loading = false;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.error = action.error.message; // Set error if failed
        state.loading = false;
      })
      
      // Add a new course
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload); // Add the new course to the state
      })
      
      // Update an existing course
      .addCase(updateCourse.fulfilled, (state, action) => {
        const index = state.courses.findIndex((course) => course._id === action.payload._id);
        if (index !== -1) {
          state.courses[index] = action.payload; // Update the course in the state
        }
      })
      
      // Delete a course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((course) => course._id !== action.payload); // Remove the course from state
      });
  },
});

export default courseSlice.reducer;
