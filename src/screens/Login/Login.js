import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../../components/Auth/AuthForm';
import './Login.css';
import { environments } from '../../environments/environments';
import { toast } from 'react-toastify';

const Login = ({ isDarkMode, onLogin }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverWaking, setServerWaking] = useState(false);

  const handleLogin = async ({ email, password }) => {
    setError('');
    setLoading(true);

    try {
      const startTime = Date.now();
      const response = await fetch(`${environments.apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const elapsed = Date.now() - startTime;
      if (elapsed > 5000) setServerWaking(true); 

      const data = await response.json();
      if (data.data?.token) {
        localStorage.setItem('token', data.data.token);
        toast.success('Login Successful.', {
          position: 'top-center',
          autoClose: 3000,
          theme: isDarkMode ? 'dark' : 'light',
        });
        onLogin();
        navigate('/');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Error logging in');
    } finally {
      setLoading(false);
      setServerWaking(false);
    }
  };

  return (
    <div className={`auth-screen ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <h2>Login</h2>
      {error && <p className="error">{error}</p>}
      {loading && <p className="loading">Processing...</p>}
      {serverWaking && <p className="info">Server is waking up, please wait...</p>}
      <AuthForm onSubmit={handleLogin} buttonText={loading ? 'Logging in...' : 'Login'} isDarkMode={isDarkMode} />
      <p>
        Don't have an account? <span onClick={() => navigate('/signup')}>Sign Up</span>
      </p>
    </div>
  );
};

export default Login;
