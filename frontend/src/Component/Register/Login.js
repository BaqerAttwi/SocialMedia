import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8800/routes/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emailOrUsername, password }),
      });
      const data = await response.json();
      if (data.success) {
        // Save the token in localStorage
        localStorage.setItem('token', data.token);
        // Redirect to the EditP page upon successful login
        navigate('/GlobalPage');
      } else {
        setError(data.message); // Set error message received from the server
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred. Please try again.'); // Handle errors appropriately
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email or Username:</label>
          <input type="text" value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)} />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
