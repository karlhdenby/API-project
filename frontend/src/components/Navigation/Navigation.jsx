import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import './Navigation.css';

function Navigation({ isLoaded }) {
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
      <>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
        <OpenModalButton
          buttonText="Sign Up"
          modalComponent={<SignupFormModal />}
        />
      </>
    );
  }

  return (
    <nav className="navbar">
      <NavLink exact to="/" className="navbar-logo">
        <img src="https://thumbs.dreamstime.com/z/airbnb-logo-white-image-maroon-background-93709646.jpg" alt="Airbnb logo" className="logo"/>
      </NavLink>
      <div className="navbar-menu">
        {isLoaded && sessionLinks}
      </div>
    </nav>
  );
}

export default Navigation;
