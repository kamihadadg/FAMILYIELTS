import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout(); // پاک کردن توکن و وضعیت کاربر
    navigate('/login'); // هدایت به صفحه ورود
    setIsMobileMenuOpen(false); // بستن منوی موبایل
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          IELTS Flashcards
        </Link>

        <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="navbar-item">
            <Link to="/" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/flashcards" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
              Flashcards
            </Link>
          </li>
          {user ? (
            <>
              <li className="navbar-item">
                <Link to="/profile" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Profile
                </Link>
              </li>
              <li className="navbar-item">
                <button onClick={handleSignOut} className="navbar-button sign-out">
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="navbar-item">
                <Link to="/login" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="navbar-item">
                <Link to="/register" className="navbar-link" onClick={() => setIsMobileMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="navbar-hamburger" onClick={toggleMobileMenu}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;