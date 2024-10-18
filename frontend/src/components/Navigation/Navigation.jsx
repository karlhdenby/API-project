import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import SignupFormModal from "../SignupFormModal/SignupFormModal";
import * as sessionActions from "../../store/session"
import { FaUserCircle } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import "./Navigation.css";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const modalRef = useRef();
  const guyRef = useRef()
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const logout = (e) => {
        setShowMenu(false)
        e.preventDefault();
        navigate('/');
        dispatch(sessionActions.logout());
      };

  const closeMenu = () => setShowMenu(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !guyRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setShowMenu, showMenu]);

  const handleClick = () => {
    if (showMenu) setShowMenu(false);
    else if (!showMenu) setShowMenu(true)
  };

  let sessionLinks;
  if (sessionUser) {
    let user = sessionUser
    sessionLinks = (
      <>
        <NavLink to="/spots/new" className="create-spot-button" data-testid="create-new-spot-button">
          Create a New Spot
        </NavLink>
        <button
          ref={guyRef}
          className="profile-button"
          onClick={handleClick}
          data-testid="user-menu-button"
        >
          <img
            src="https://static.vecteezy.com/system/resources/previews/038/147/992/original/ai-generated-man-waving-hand-and-smiling-on-transparent-background-image-png.png"
            alt="Profile logo"
            className="profile-logo"
          />
        </button>
        {showMenu && (
        <ul className="profile-dropdown" ref={modalRef} data-testid="user-dropdown-menu">
          <li>Hello, {user.firstName}</li>
          <li>{user.email}</li>
          <li>
            <NavLink to="/spots/current">Manage Spots</NavLink>
          </li>
          <li>
            <button onClick={logout}>Log Out</button>
          </li>
        </ul>
      )}
      </>
    );
  } else {
    sessionLinks = (
      <div className="dropdown" ref={modalRef}>
        <button
          className="profile-button"
          onClick={handleClick}
          data-testid="user-menu-button"
        >
          <FaUserCircle />
        </button>
        <div
          className="dropdown-content"
          id={`${
            showMenu ? "dropdown-button-clicked" : "dropdown-button-not-clicked"
          }`}
          data-testid="user-dropdown-menu"
        >
          <OpenModalButton
            onButtonClick={closeMenu}
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
          <OpenModalButton
            id={"log-in-button-modal"}
            onButtonClick={closeMenu}
            data-testid="login-button"
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
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
      <div className="navbar-menu">{isLoaded && sessionLinks}</div>
    </nav>
  );
}

export default Navigation;
