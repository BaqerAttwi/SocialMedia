import React, { useState } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { Link } from 'react-router-dom';

const FormSignup = () => {
    const [formdata, setFormdata] = useState({
        UserName: "",
        email: "",
        Password: "",
        DateOfBirth: "",
        Gender: "",
        Nationality: "",
        image: null
    });

    const [errors, setErrors] = useState({});
    const [backendError, setBackendError] = useState('');

    const validationSchema = Yup.object().shape({
        UserName: Yup.string().required("User name is required"),
        email: Yup.string().required("Email is required").email("Invalid email format"),
        Password: Yup.string().required("Password is required").min(8, "Password must be at least 8 characters long").matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol").matches(/[0-9]/, "Password must contain at least one digit").matches(/[A-Z]/, "Password must contain at least one uppercase letter").matches(/[a-z]/, "Password must contain at least one lowercase letter"),
        DateOfBirth: Yup.date().typeError("Date of birth must be a valid date").required("Date of birth is required"),
        Gender: Yup.string().required("Gender is required"),
        Nationality: Yup.string().required("Nationality is required").min(4, 'must be at least 4 letters')
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormdata({ ...formdata, image: file });
    };

    const senddata = async () => {
        
        try {
            const formData = new FormData();
            formData.append('image', formdata.image);
            formData.append('email', formdata.email);
            formData.append('password', formdata.Password);
            formData.append('username', formdata.UserName);
            formData.append('date_of_birth', formdata.DateOfBirth);
            formData.append('gender', formdata.Gender);
            formData.append('nationality', formdata.Nationality);

            const response = await axios.post("http://localhost:8800/routes/signinfoupload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        console.log("Response:", response.data);
    } catch (err) {
        if (err.response && err.response.data && err.response.data.error) {
            const errorMessage = err.response.data.error;
            if (errorMessage.includes('Email')) {
                setErrors({ ...errors, email: errorMessage });
            } else if (errorMessage.includes('Username')) {
                setErrors({ ...errors, username: errorMessage });
            } else {
                setBackendError(errorMessage);
            }
        } else {
            console.error("Error:", err);
        }
    }
};
    const handleValidation = async (e) => {
        e.preventDefault();
        setBackendError('');
        console.log('phase1');
        try {
          const vw=  await validationSchema.validate(formdata, { abortEarly: false });
           const n= await checkNationality(formdata.Nationality);
            console.log('phase2');
            if (vw&&n) {
                senddata();
                console.log("Form submitted", formdata);
                console.log('phase3');
            }
            console.log('phase3');
        } catch (error) { console.log('phase4');
            if (error.response) { console.log('phase5');
                setErrors({ ...errors, Nationality: "Nationality does not exist" });
            } else { console.log('phase6');
                error.inner.forEach((err) => {
                    setErrors({ ...errors, [err.path]: err.message });
                });
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormdata({ ...formdata, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };

    const checkNationality = async (nationality) => {
        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${nationality}`);
            if (response.data.length === 0) {
                throw new Error("Nationality does not exist");
            }else return true;
        } catch (err) {
            throw err;
        }
    };

    return (
        <form className='registration-form' onSubmit={handleValidation}>
            
            {backendError && <div className="error">{backendError}</div>}
            <div className="form-group">
                <label>Profile Image:</label>
                <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                />
                {errors.image && <div className="error">{errors.image}</div>}
            </div>
            <div className="form-group">
                <label>UserName:</label>
                <input
                    type="text"
                    name="UserName"
                    value={formdata.UserName}
                    placeholder="Enter your UserName"
                    onChange={handleChange}
                />
                {errors.UserName && <div className="error">{errors.UserName}</div>}
            </div>
            <div className="form-group">
                <label>Email:</label>
                <input
                    type='email'
                    name='email'
                    value={formdata.email}
                    placeholder='Enter your email'
                    onChange={handleChange}
                />
                {errors.email && <div className="error">{errors.email}</div>}
            </div>
            <div className="form-group">
                <label>Password:</label>
                <input
                    type='password'
                    name='Password'
                    value={formdata.Password}
                    placeholder='Enter your Password'
                    onChange={handleChange}
                />
                {errors.Password && <div className="error">{errors.Password}</div>}
            </div>
            <div className="form-group">
                <label>Date Of Birth:</label>
                <input
                    type='date'
                    name='DateOfBirth'
                    value={formdata.DateOfBirth}
                    onChange={handleChange}
                />
                {errors.DateOfBirth && <div className="error">{errors.DateOfBirth}</div>}
            </div>
            <div className="form-group">
                <label>Gender :</label>
                <select
                    name="Gender"
                    value={formdata.Gender}
                    onChange={handleChange}
                >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                {errors.Gender && <div className="error">{errors.Gender}</div>}
            </div>
            <div className="form-group">
                <label>Nationality:</label>
                <input
                    type='text'
                    name='Nationality'
                    value={formdata.Nationality}
                    placeholder='Enter your Nationality'
                    onChange={handleChange}
                />
                {errors.Nationality && <div className="error">{errors.Nationality}</div>}
                {errors.Nationality === "Nationality does not exist" && <div className="error">Nationality does not exist</div>}
            </div>
            <button type='submit' onClick={handleValidation}>Submit</button>
            <Link to="./login">Go to Another Page</Link>
        </form>
    );
}

export default FormSignup;
