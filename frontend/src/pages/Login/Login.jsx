import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Login.module.css';
import { signIn } from '../../services/auth/signIn';
import loginDto from '../../services/auth/dto/loginDto';
import HomeButton from '../../components/HomeButton';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleInputChanging = (e) => {
    const { name, value } = e.target;

    if (name === 'username') setUsername(value);
    if (name === 'password') setPassword(value);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const logForm = new loginDto(username, password);
      await signIn(logForm);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Error during signing in');
    }
  };

  const isFormValid = username.trim() && password;

  const switchVision = (e) => {
    const { name } = e.currentTarget;
    if (name === 'password') setShowPassword((previous) => !previous);
  };

  if (error) return <div className={styles.error}>Error: {error}</div>;

  return (
    <div>
      <div className={styles.homeButton}>
        <HomeButton />
      </div>
      <div className={styles.login}>
        <div>
          <h1>Введіть дані для входу</h1>
          <form className={styles.form} method='post' onSubmit={handleSignIn}>
            <div>
              <label>Юзернейм</label>
              <input
                name='username'
                type='text'
                placeholder='Напишіть свій юзернейм'
                value={username}
                onChange={handleInputChanging}
              />
            </div>

            <div>
              <label>Пароль</label>
              <div className={styles.passwordField}>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Введіть пароль'
                  value={password}
                  onChange={handleInputChanging}
                />
                <button
                  name='password'
                  type='button'
                  onClick={switchVision}
                  className={styles.passwordButton}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <button
              className={styles.submitButton}
              type='submit'
              disabled={!isFormValid}
            >
              Увійти
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
