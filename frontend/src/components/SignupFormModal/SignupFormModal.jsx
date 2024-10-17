import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

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
  const modalRef = useRef();

  const validateFields = () => {
    
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    if (!username) newErrors.username = "Username is required";
    if (username && username.length < 4)
      newErrors.username = "Username must be at least 4 characters long";
    if (!firstName) newErrors.firstName = "First Name is required";
    if (!lastName) newErrors.lastName = "Last Name is required";
    if (!password) newErrors.password = "Password is required";
    if (password && password.length < 6)
      newErrors.password = "Password must be at least 6 characters long";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords must match";

    
    setErrors(newErrors);
    console.log(errors)

    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHasSubmitted(true);
    console.log(errors)
    if (!validateFields()) return;

    try {
      console.log(email, username, firstName, lastName, password);
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
        const data = response;
        console.log(data);
        if (data && data.errors) {
          const backendErrors = {};
          for (let key in data.errors) {
            backendErrors[key] = data.errors[key];
          }
          setErrors(backendErrors);
          console.log(backendErrors);
        }
      } else {
        closeModal();
      }
    } catch (error) {
      console.log(await error);
      setErrors({ general: "hello" });
    }
  };

  return (
    <div className="signup-modal" ref={modalRef} data-testid="sign-up-form">
      <h1>Sign Up</h1>
      {hasSubmitted && Object.keys(errors).length > 0 && (
        <div className="error-message">
          {errors.username && <p data-testid="username-error-message">{errors.username}</p>}
          {errors.email && <p data-testid="email-error-message">{errors.email}</p>}
          {errors.firstName && <p data-testid="firstName-error-message">{errors.firstName}</p>}
          {errors.lastName && <p data-testid="lastName-error-message">{errors.lastName}</p>}
          {errors.password && <p data-testid="password-error-message">{errors.password}</p>}
          {errors.confirmPassword && <p data-testid="confirmPassword-error-message">{errors.confirmPassword}</p>}
          {errors.general && <p data-testid="general-error-message">{errors.general}</p>}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            data-testid="email-input"
            type="text"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateFields();
            }}
          />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input
            data-testid="username-input"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              validateFields();
            }}
          />
        </div>
        <div className="form-group">
          <label>First Name</label>
          <input
            data-testid="first-name-input"
            type="text"
            value={firstName}
            onChange={(e) => {
              setFirstName(e.target.value);
              validateFields();
            }}
          />
        </div>
        <div className="form-group">
          <label>Last Name</label>
          <input
            data-testid="last-name-input"
            type="text"
            value={lastName}
            onChange={(e) => {
              setLastName(e.target.value);
              validateFields();
            }}
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            data-testid="password-input"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              validateFields();
            }}
          />
        </div>
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            data-testid="confirm-password-input"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              validateFields();
            }}
          />
        </div>
        <button
          disabled={
            !password ||
            !firstName ||
            !lastName ||
            !username ||
            !confirmPassword ||
            !email || username.length < 4 || password.length < 6
          }
          type="submit"
          className="submit-button"
          data-testid="form-sign-up-button"
        >
          Sign Up
        </button>
        {hasSubmitted && Object.keys(errors).length > 0 && (
          <p className="error-message">
            Please fill out all fields correctly to enable the sign-up button.
          </p>
        )}
      </form>
    </div>
  );
}

export default SignupFormModal;
