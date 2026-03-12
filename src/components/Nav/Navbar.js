import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ReactComponent as Dark } from '../../assets/dark.svg';
import { ReactComponent as Light } from '../../assets/light.svg';
import { ReactComponent as MenuIcon } from '../../assets/menu.svg';
import { environments } from '../../environments/environments';
import './Navbar.css';

const Navbar = ({ isDarkMode, toggleTheme, isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [displayedUsername, setDisplayedUsername] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  const fetchHistory = async () => {
    try {
      const response = await fetch(environments.apiUrl + '/api/history/user', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      if(response.status == 400){
        localStorage.removeItem('token');
        onLogout()
        return
      }
      if (data) {
        setUser(data);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching history:', err);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchHistory();
    }
  }, [isLoggedIn]);

  const handleMenuClick = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (user) {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= user?.name?.length) {
          setDisplayedUsername(user.name.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setShowCursor(false);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogoutClick = () => {
    setShowLogoutPopup(true);
  };

  const confirmLogout = () => {
    setShowLogoutPopup(false);
    setUser(null)
    onLogout();
  };

  const cancelLogout = () => {
    setShowLogoutPopup(false);
  };

  return (
    <div className="navbar-container">
      <nav className={`navbar ${isDarkMode ? 'dark-mode' : 'light-mode'}`}>
        <div className="navbar-left">
          <div>
            <h1>Structify </h1>
            <p className="tagline">JSON to TypeScript in a click</p> </div>
          <div className="menu-items">
            <button className="menu-icon-dark" onClick={toggleTheme}>
              {isDarkMode ? <Dark /> : <Light />}
            </button>
            <button className="menu-icon" onClick={handleMenuClick}>
              <MenuIcon />
            </button>
          </div>
        </div>
        <div className={`navbar-right ${isMenuOpen ? 'open' : ''}`}>
        <button className="menu-icon-dark-1" onClick={toggleTheme}>
              {isDarkMode ? <Dark /> : <Light />}
            </button> 
          {isLoggedIn ? (
            <>
              <button onClick={handleLogoutClick}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')}>Login</button>
              <button onClick={() => navigate('/signup')}>Sign Up</button>
            </>
          )}
        </div>
      </nav>
      <div className="user">
        <p>
          Hi,{' '}
          <span className="username">
            {user ? displayedUsername : 'Dev'}
            {showCursor && <span className="cursor"></span>}
          </span>
        </p>
      </div>

      {/* Logout Confirmation Popup */}
      {showLogoutPopup && (
        <div className="logout-popup">
          <div className="popup-content">
            <p>Are you sure you want to logout?</p>
            <div className="popup-buttons">
              <button onClick={confirmLogout} className="confirm-btn">Yes</button>
              <button onClick={cancelLogout} className="cancel-btn">No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
