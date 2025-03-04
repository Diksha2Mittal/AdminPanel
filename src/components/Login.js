import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/features/authSlice';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS directly here

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const Dispatch = useDispatch();
  const Navigate = useNavigate();
  const { token, error } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    Dispatch(loginUser({ email, password }));
  };

  if (token) {
    Navigate('/dashboard');
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="heading">Login</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
          <p className="signup-link">
            Don't have an account? <Link to='/Signup' className="link">Signup</Link>
          </p>
          <button type="submit" className="button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
