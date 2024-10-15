import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { FaUserCircle } from 'react-icons/fa';
import { useState } from 'react';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleClick = () => {
    if (showMenu) setShowMenu(false)
    if (!showMenu) setShowMenu(true)
  }

  const sessionUser = useSelector((state) => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <>
        <NavLink to="/spots/new" className="create-spot-button">
          Create a New Spot
        </NavLink>
        <ProfileButton user={sessionUser} />
      </>
    );
  } else {
    sessionLinks = (
      <div className="dropdown" >
        <button className="dropbtn" onClick={handleClick} id={`${showMenu ? 'dropdown-button-clicked' : ''}`}>
          <FaUserCircle className="user-icon" />
        </button>
        <div className="dropdown-content">
          <OpenModalButton
            data-testid="login-button"
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
          <OpenModalButton 
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </div>
    );
  }

  return (
    <nav className="navbar">
      <NavLink exact to="/" className="navbar-logo" data-testid="logo">
        <img
          src="https://www.muv.co.uk/cdn-cgi/image/width=1200,height=675,quality=80,format=auto,onerror=redirect,metadata=none/cdn-cgi/image/quality=80,format=auto,onerror=redirect,metadata=none/wp-content/uploads/2024/01/steamboat.jpg"
          alt="Airbnb logo"
          className="logo"
        />
      </NavLink>
      <div className="navbar-menu" data-testid="user-dropdown-menu">
        {isLoaded && sessionLinks}
      </div>
    </nav>
  );
}

export default Navigation;
