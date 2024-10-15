import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './ProfileButton.css';
import { useNavigate } from 'react-router-dom';

function ProfileButton({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Prevent the click event from bubbling up
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const logout = (e) => {
    e.preventDefault();
    navigate('/');
    dispatch(sessionActions.logout());
  };

  return (
    <>
      <button onClick={toggleMenu} className="profile-button" data-testid="user-menu-button">
        <img
          src="https://static.vecteezy.com/system/resources/previews/038/147/992/original/ai-generated-man-waving-hand-and-smiling-on-transparent-background-image-png.png"
          alt="Profile logo"
          className="profile-logo"
        />
      </button>
      {showMenu && (
        <ul className="profile-dropdown" ref={ulRef}>
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
}

export default ProfileButton;
