import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './screens/Login/Login';
import Signup from './screens/Signup/Signup';
import Home from './screens/Home/Home';
import './App.css';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in on page load
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <div className={`App ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
      <Router>
        <Routes>
          <Route
            path="/login"
            element={<Login isDarkMode={isDarkMode} onLogin={handleLogin} />}
          />
          <Route
            path="/signup"
            element={<Signup isDarkMode={isDarkMode} onSignup={handleLogin} />}
          />
          <Route
            path="/"
            element={
              <Home
                isDarkMode={isDarkMode}
                toggleTheme={toggleTheme}
                isLoggedIn={isLoggedIn}
                onLogout={handleLogout}
              />
            }
          />
        </Routes>
      </Router>
      <ToastContainer
        position="top-center"
        autoClose={3000} // Close toast after 3 seconds
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={isDarkMode ? 'dark' : 'light'} // Match toast theme with app theme
      />
    </div>
  );
};

export default App;