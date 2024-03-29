import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import { getDatabase, ref, push } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ProfileForm() {
  const database = getDatabase();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    major: '',
    grade: '',
    email: '',
    bio: '',
    graduationDate: null
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleGraduationDateChange = (date) => {
    setFormData({
      ...formData,
      graduationDate: date
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newData = { ...formData };
      // Convert graduation date to ISO string format before saving
      newData.graduationDate = formData.graduationDate ? formData.graduationDate.toISOString() : null;
      push(ref(database, 'profileData'), newData)
        .then(() => {
          alert('Profile saved successfully!');
          setFormData({
            name: '',
            major: '',
            grade: '',
            email: '',
            bio: '',
            graduationDate: null
          });
        })
        .catch((error) => {
          console.error('Error saving profile:', error);
          alert('Error saving profile. Please try again later.');
        });
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again later.');
    }
    navigate('/friends');
  };

  return (
    <div>
      <Header />
      <div className="profile-container">
        <h2 id="submit-title">Submit Your Profile!</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <label>Major:</label>
            <input type="text" name="major" value={formData.major} onChange={handleChange} required />
          </div>
          <div>
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="grade">Grade</label>
            <select name="grade" className="grade-picker" value={formData.grade} onChange={handleChange} required>
              <option value="">Select your grade</option>
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
            </select>
          </div>
          <div>
            <label>Graduation Date:</label>
            <DatePicker
              selected={formData.graduationDate}
              onChange={handleGraduationDateChange}
              dateFormat="MM/dd/yy"
              placeholderText="Select graduation date"
              required
            />
          </div>
          <div>
            <label>Bio:</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange}></textarea>
          </div>
          <button type="submit">Submit!</button>
        </form>
      </div>
      <Footer />
    </div>
  );
}

export default ProfileForm;
