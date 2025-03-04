import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createUser } from '../redux/features/userSlice';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './Login.css';  // Import your Login.css for styling

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    age: '',
    address: '',
    image: null
  });

  const Dispatch = useDispatch();
  const Navigate = useNavigate();

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);
    formDataToSend.append('dateOfBirth', formData.dateOfBirth);
    formDataToSend.append('age', formData.age);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('image', formData.image);

    try {
      const resultAction = await Dispatch(createUser(formDataToSend));

      if (createUser.fulfilled.match(resultAction)) {
        Navigate('/Login');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred during sign up.');
    }
  };

  return (
    <div className="container">  {/* Apply container class for centering */}
      <div className="form-container">  {/* Apply form-container for styling */}
        <h2 className="heading">Sign Up</h2>
        <form className="form" onSubmit={handleSubmit}>
          <input
            className="input"
            type="text"
            placeholder="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          <input
            className="input"
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            className="input"
            type="password"
            placeholder="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            className="input"
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          <input
            className="input"
            type="number"
            placeholder="Age"
            name="age"
            value={formData.age}
            onChange={handleChange}
          />
          <input
            className="input"
            type="text"
            placeholder="Address"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
          <input
            className="input"
            type="file"
            name="image"
            onChange={handleChange}
          />
          <p className="signup-link">Already have an account? <Link className="link" to='/Login'>Login</Link></p>
          <button className="button" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
