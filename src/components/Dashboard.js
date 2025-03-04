import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCourses, addCourse, deleteCourse, updateCourse } from '../redux/features/courseSlice';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Import your CSS for styling

const Dashboard = () => {
  const Dispatch = useDispatch();
  const Navigate = useNavigate();
  const { courses, loading } = useSelector((state) => state.courses);
  const { token } = useSelector((state) => state.auth);

  // State for form data
  const [courseData, setCourseData] = useState({
    title: '',
    description: '',
  });

  // Edit state for updating courses
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);

  useEffect(() => {
    if (!token) {
      Navigate('/profile');
    } else {
      Dispatch(fetchCourses()); // Fetch courses when the token is available
    }
  }, [token, Dispatch, Navigate]);

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle adding and updating courses
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      // Dispatch the action to update the course
      Dispatch(updateCourse({ courseId: currentCourseId, courseData })).then(() => {
        Dispatch(fetchCourses()); // Fetch updated courses after update
      });
    } else {
      // Dispatch the action to add a new course
      Dispatch(addCourse(courseData)).then(() => {
        Dispatch(fetchCourses()); // Fetch updated courses after adding
      });
    }
    // Reset form state
    setCourseData({ title: '', description: '' });
    setIsEditing(false);
  };

  // Handle editing a course
  const handleEdit = (courseId, courseTitle, courseDescription) => {
    setCurrentCourseId(courseId);
    setCourseData({ title: courseTitle, description: courseDescription });
    setIsEditing(true); // Set editing mode
  };

  // Handle deleting a course
  const handleDelete = (courseId) => {
    Dispatch(deleteCourse(courseId)).then(() => {
      Dispatch(fetchCourses()); // Fetch updated courses after deletion
    });
  };

  // Show loading state while fetching courses
  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Dashboard</h2>

      {/* Course Form */}
      <div className="course-form-container">
        <h3>{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
        <form className="course-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={courseData.title}
            onChange={handleChange}
            className="input"
          />
          <textarea
            name="description"
            placeholder="Course Description"
            value={courseData.description}
            onChange={handleChange}
            className="textarea"
          />
          <button type="submit" className="submit-button">
            {isEditing ? 'Update Course' : 'Add Course'}
          </button>
        </form>
      </div>

      {/* Displaying Courses in Table */}
      <div className="courses-list">
        <h4>Your Courses</h4>
        {courses.length === 0 ? (
          <p>No courses available.</p>
        ) : (
          <table className="courses-table">
            <thead>
              <tr>
                <th>Course ID</th>
                <th>Course Title</th>
                <th>Course Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course) => (
                <tr key={course._id}>
                  <td>{course._id}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>
                    <button onClick={() => handleEdit(course._id, course.title, course.description)}>Edit</button>
                    <button onClick={() => handleDelete(course._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Navigation Button */}
      <button className="navigate-button" onClick={() => Navigate('/Profile')}>Go to Profile</button>
    </div>
  );
};

export default Dashboard;
