import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import './LoginForm.css';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const isDisabled = credential.length < 4 || password.length < 6;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else {

          setErrors({ credential: "The provided credentials were invalid." });
        }
      });
  };

  const handleDemoUser = () => {
    setErrors({});
    return dispatch(sessionActions.login({ credential: "TestGuy", password: "password" }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        } else {

          setErrors({ credential: "The provided credentials were invalid." });
        }
      });
  };

  return (
    <div className="login-modal">
      <h1>Log In</h1>
      {errors.credential && (
        <p className="error">{errors.credential}</p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Username or Email
          </label>
          <input
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={isDisabled} className="submit-button">Log In</button>
      </form>
      <button onClick={handleDemoUser} className="demo-user-button">Demo User</button>
    </div>
  );
}

export default LoginFormModal;
