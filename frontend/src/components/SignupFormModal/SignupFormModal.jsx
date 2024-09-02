import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import './SignupForm.css';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();


  useEffect(() => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!username) newErrors.username = "Username is required";
    if (username && username.length < 4) newErrors.username = "Username must be at least 4 characters long";
    if (!firstName) newErrors.firstName = "First Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!password) newErrors.password = "Password is required";
    if (password && password.length < 6) newErrors.password = "Password must be at least 6 characters long";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords must match";

    setErrors(newErrors);
  }, [email, username, firstName, lastName, password, confirmPassword]);

  const isDisabled = Object.keys(errors).length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords must match" });
      return;
    }

    try {
      const response = await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      );

      if (response.ok) {
        closeModal();
      } else {
        const data = await response.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else if (!Object.keys(errors).length) {
          setErrors({ username: "Username must be unique" });
        } else {
          setErrors({ general: "An error occurred. Please try again." });
        }
      }
    } catch (error) {
      const data = await error;
      if (data && data.errors) {
        setErrors(data.errors);
      } else if (!Object.keys(errors).length) {
        setErrors({ username: "Username must be unique" });
      } else {
        setErrors({ general: "An error occurred. Please try again." });
      }
    }
  };

  return (
    <div className="signup-modal">
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstName && <p className="error">{errors.firstName}</p>}
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastName && <p className="error">{errors.lastName}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
        </div>
        <button type="submit" disabled={isDisabled} className="submit-button">
          Sign Up
        </button>
        {isDisabled && <p className="error">Please fill out all fields correctly to enable the sign-up button.</p>}
        {errors.general && <p className="error">{errors.general}</p>}
      </form>
    </div>
  );
}

export default SignupFormModal;
