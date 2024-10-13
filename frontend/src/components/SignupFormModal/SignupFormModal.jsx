import { useState } from 'react';
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
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { closeModal } = useModal();

  const validateFields = () => {
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

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);

    if (!validateFields()) return;

    try {
      console.log(email, username, firstName, lastName, password)
      const response = await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      );

      if (!response.ok) {
        const data = response
        console.log(data)
        if (data && data.errors) {
          const backendErrors = {};
          for (let key in data.errors) {
            backendErrors[key] = data.errors[key]
          }
          setErrors(backendErrors);
          console.log(backendErrors)
        }
      } else {
        closeModal();
      }
    } catch (error) {
      console.log(await error)
      setErrors({ general: "hello" });
    }
  };

  return (
    <div className="signup-modal">
      <h1>Sign Up</h1>
      {hasSubmitted && Object.keys(errors).length > 0 && (
        <div className="error-message">
          {errors.username && <p>{errors.username}</p>}
          {errors.email && <p>{errors.email}</p>}
          {errors.firstName && <p>{errors.firstName}</p>}
          {errors.lastName && <p>{errors.lastName}</p>}
          {errors.password && <p>{errors.password}</p>}
          {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          {errors.general && <p>{errors.general}</p>}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">
          Sign Up
        </button>
        {hasSubmitted && Object.keys(errors).length > 0 && (
          <p className="error-message">Please fill out all fields correctly to enable the sign-up button.</p>
        )}
      </form>
    </div>
  );
}

export default SignupFormModal;
