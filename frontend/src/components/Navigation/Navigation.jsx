import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import { FaUserCircle } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (showMenu) setShowMenu(false)
  }, [showMenu])

  const handleClick = () => {
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
        <button className="dropbtn" onClick={handleClick} data-testid="user-menu-button">
          <FaUserCircle className="user-icon" />
        </button>
        <div className="dropdown-content" id={`${showMenu ? 'dropdown-button-clicked' : 'dropdown-button-not-clicked'}`}>
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
