import React, { useState } from 'react';
import axios from 'axios';
import './PostComponent.css'; // Import CSS file for styling
import NavBar from '../NavBar/Nav';

const PostComponent = () => {
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if text is appropriate before submitting
    const isTextAppropriate = await checkTextAppropriateness(text);
    if (!isTextAppropriate) {
      setMessage('Inappropriate content detected. Please revise your post.');
      return;
    }

    // Proceed with form submission
    const formData = new FormData();
    formData.append('description', text);
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:8800/routes/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
    } catch (error) {
      setMessage('Error uploading data.');
      console.error('Error uploading data:', error);
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Function to check text appropriateness using API
  const checkTextAppropriateness = async (text) => {
    try {
      const response = await axios.post('http://localhost:3000/analyze-text', { text });
      return response.data.isAppropriate;
    } catch (error) {
      console.error('Error checking text appropriateness:', error);
      // Default to true if there's an error with the API request
      return true;
    }
  };

  return (
    <div>
      <NavBar />
      <div className='Global-container'>
        <h2>Post Upload Form</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter description"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <div className='post-list'>
              {text && <p className="input-effect">Text Uploaded: {text}</p>}
              {image && (
                <div>
                  <p className="input-effect">Image Uploaded:</p>
                  <img className="image-preview" src={URL.createObjectURL(image)} alt="Image Preview" />
                </div>
              )}
            </div>
          </div>
          <button type="submit">Submit</button>
        </form>
        {message && <p>{message}</p>}
      </div>
    </div>
  );
};

export default PostComponent;
