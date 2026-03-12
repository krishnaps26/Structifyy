import React, { useState } from 'react';
import './AuthForm.css';
import { toast } from 'react-toastify';

const AuthForm = ({ onSubmit, buttonText, isDarkMode }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 4; // Password must be at least 5 characters
  };

  const validateUsername = (username) => {
    return username.trim() !== ''; // Username must not be empty
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation for Sign Up
    if (buttonText === 'Sign Up') {
      if (!username || !email || !password) {
        toast.error('Please fill out all fields.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? 'dark' : 'light',
        });
        return;
      }

      if (!validateUsername(username)) {
        toast.error('Username cannot be empty.', {
          position: 'top-center',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: isDarkMode ? 'dark' : 'light',
        });
        return;
      }
    }

    // Validation for Email
    if (!validateEmail(email)) {
      toast.error('Please enter a valid email address.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? 'dark' : 'light',
      });
      return;
    }

    // Validation for Password
    if (!validatePassword(password)) {
      toast.error('Password must be at least 5 characters long.', {
        position: 'top-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: isDarkMode ? 'dark' : 'light',
      });
      return;
    }

    // If all validations pass, submit the form
    if (buttonText === 'Sign Up') {      
      onSubmit({ username, email, password });
    } else {
      onSubmit({ email, password });
    }
  };

  return (
    <form className={`auth-form ${isDarkMode ? 'dark-mode' : 'light-mode'}`} onSubmit={handleSubmit}>
      {buttonText === 'Sign Up' && (
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      )}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">{buttonText}</button>
    </form>
  );
};

export default AuthForm;