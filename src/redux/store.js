import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice'
import userReducer from './features/userSlice';
import courseReducer from './features/courseSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    courses: courseReducer,
  },
});

export default store;
