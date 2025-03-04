import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, updateUserProfile, deleteUserProfile } from '../redux/features/userSlice';
import './Profile.css';

const Profile = () => {
  const Dispatch = useDispatch();
  const Navigate = useNavigate();
  const { userInfo, loading, error } = useSelector(state => state.user);
  const { token } = useSelector((state) => state.auth)
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    address: '',
    dateOfBirth: '',
    image: null,
  });

  useEffect(() => {
    if (token) {
      Dispatch(fetchUserProfile(token)); // Fetch profile if token exists
    } else {
      Navigate('/login'); // Redirect to login if no token
    }
  }, [Dispatch, token, Navigate]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name,
        email: userInfo.email,
        age: userInfo.age || '',
        address: userInfo.address || '',
        dateOfBirth: userInfo.dateOfBirth || '',
        image: userInfo.image || null,
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    Object.keys(formData).forEach(key => {
      updatedData.append(key, formData[key]);
    });

    Dispatch(updateUserProfile({ updatedData, token }));
    setEditMode(false); // Disable edit mode after submission
  };

  const handleDelete = () => {
    Dispatch(deleteUserProfile(token));
     // Redirect to login after deletion
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="profile">
      <h1>User Profile</h1>
      <div>
        <p><strong>Name:</strong> {formData.name}</p>
        <p><strong>Email:</strong> {formData.email}</p>
        <p><strong>Age:</strong> {formData.age}</p>
        <p><strong>Address:</strong> {formData.address}</p>
        <p><strong>Date of Birth:</strong> {formData.dateOfBirth}</p>
        {formData.image && <img src={formData.image} alt="Profile" />}
      </div>
      <button onClick={() => setEditMode(!editMode)}>Edit Profile</button>
      <button onClick={handleDelete}>Delete Profile</button>

      {editMode && (
        <form onSubmit={handleUpdate}>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
          <input type="text" name="age" value={formData.age} onChange={handleChange} />
          <input type="text" name="address" value={formData.address} onChange={handleChange} />
          <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
          <input type="file" name="image" onChange={handleChange} />
          <button type="submit">Update</button>
        </form>
      )}
    </div>
  );
};

export default Profile;
