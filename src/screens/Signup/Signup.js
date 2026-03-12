import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm';
import './Signup.css';
import { environments } from '../../environments/environments';
import { toast } from 'react-toastify';

const Signup = ({ isDarkMode, onSignup }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);

  const handleSignup = async ({ username, email, password }) => {
    setError('');
    setLoading(true);
    
    try {
      const startTime = Date.now();
      const response = await fetch(`${environments.apiUrl}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const elapsed = Date.now() - startTime;
      if (elapsed > 5000) setServerWaking(true); 

      const data = await response.json();
      if (data.message) {
        toast.success('Account created successfully.', {
          position: 'top-center',
          autoClose: 3000,
          theme: isDarkMode ? 'dark' : 'light',
        });
        onSignup();
        navigate('/login');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err) {
      setError('Error signing up');
    } finally {
      setLoading(false);
      setServerWaking(false);
    }
  };

  return (
    <div className={`auth-screen ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h2>Sign Up</h2>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Processing...</p>}
      {serverWaking && <p className="info">Server is waking up, please wait...</p>}
      <AuthForm onSubmit={handleSignup} buttonText={loading ? 'Signing Up...' : 'Sign Up'} isDarkMode={isDarkMode} />
      <p>
        Already have an account? <span onClick={() => navigate('/login')}>Login</span>
      </p>
    </div>
  );
};

export default Signup;
