import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
const UpdateForm = () => {
    const [formData, setFormData] = useState({
        id: '',
        UserName: '',
        email: '',
        Password: '',
        DateOfBirth: '',
        Gender: '',
        nationality: '',
        image: null,
    });

    // Fetch user profile data from backend when component mounts
    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token'); // Get the token from localStorage
            if (!token) {
                alert('Not authenticated');
                return;
            }

            try {
                const response = await axios.get('http://localhost:8800/routes/profile', {
                    headers: {
                        Authorization: `Bearer ${token}` // Include the token in the request headers
                    }
                });
                if (response.data.success) {
                    setFormData({
                        id: response.data.user.id,
                        UserName: response.data.user.username,
                        email: response.data.user.email,
                        Password: '',
                        DateOfBirth: response.data.user.dateofbirth,
                        Gender: response.data.user.gender,
                        nationality: response.data.user.nationality,
                        image: null,
                    });
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
                alert('Error fetching user information');
            }
        };

        fetchProfile();
    }, []);

    // Handle form input change
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Handle file input change
    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        for (const key in formData) {
            form.append(key, formData[key]);
        }
        try {
            const token = localStorage.getItem('token'); // Get the token from localStorage
            if (!token) {
                alert('Not authenticated');
                return;
            }

            const response = await axios.post('http://localhost:8800/routes/updateUser', form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}` // Include the token in the request headers
                },
            });
            alert(response.data.message);
        } catch (error) {
            console.error('Error updating user information:', error);
            alert('Error updating user information');
        }
    };

    return (
<div className='boxeditP'>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input type="text" name="UserName" value={formData.UserName} onChange={handleChange} />
                </div>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="Password" value={formData.Password} onChange={handleChange} />
                </div>
                <div>
                    <label>Date of Birth:</label>
                    <input type="date" name="DateOfBirth" value={formData.DateOfBirth} onChange={handleChange} />
                </div>
                <div>
                    <label>Gender:</label>
                    <input type="text" name="Gender" value={formData.Gender} onChange={handleChange} />
                </div>
                <div>
                    <label>Nationality:</label>
                    <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
                </div>
                <div>
                    <label>Profile Picture:</label>
                    <input type="file" name="image" onChange={handleFileChange} />
                </div>
                <button type="submit">Update</button>
            </form>
            <Link to="">Go to Another Page</Link>
        </div>
    );
};

export default UpdateForm;
