import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import styles from './Registration.module.css';
import { signUp } from '../../services/auth/signUp';
import registerDto from '../../services/auth/dto/registerDto';
import { useNavigate } from 'react-router-dom';
import HomeButton from '../../components/HomeButton';

export default function Registration() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  const handleInputChanging = (e) => {
    const { name, value } = e.target;

    if (name === 'name') setName(value);
    if (name === 'surname') setSurname(value);
    if (name === 'username') setUsername(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'checkPassword') setCheckPassword(value);
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const registerForm = new registerDto(
        name,
        surname,
        username,
        email,
        password
      );

      await signUp(registerForm);
      navigate('/');
    } catch (err) {
      setError(err.messages);
    }
  };

  const isFormValid =
    name.trim() &&
    surname.trim() &&
    username.trim() &&
    email.trim() &&
    password &&
    checkPassword &&
    password === checkPassword;

  const switchVision = (e) => {
    const { name } = e.currentTarget;
    if (name === 'password') setShowPassword((previous) => !previous);
    if (name === 'checkPassword') setShowCheckPassword((previous) => !previous);
  };

  if (error.length) console.log(error);
  return (
    <div>
      <div className={styles.homeButton}>
        <HomeButton />
      </div>
      <div className={styles.registration}>
        <div>
          <h1>Введіть дані для реєстрації</h1>
          {error.length ? (
            error.map((err, index) => (
              <h5 key={index} className={styles.error}>
                {err}
              </h5>
            ))
          ) : (
            <></>
          )}
          <form className={styles.form} method='post' onSubmit={handleSignUp}>
            <div>
              <label>Ім'я</label>
              <input
                name='name'
                type='text'
                placeholder='Введіть своє ім`я'
                value={name}
                onChange={handleInputChanging}
              />
            </div>
            <div>
              <label>Прізвище</label>
              <input
                name='surname'
                type='text'
                placeholder='Введіть своє прізвище'
                value={surname}
                onChange={handleInputChanging}
              />
            </div>
            <div>
              <label>Юзернейм</label>
              <input
                name='username'
                type='text'
                placeholder='Вигадайте цікавий юзернейм (латиницею)'
                value={username}
                onChange={handleInputChanging}
              />
            </div>
            <div>
              <label>Електронна пошта</label>
              <input
                name='email'
                type='email'
                placeholder='Введіть свою електронну пошту'
                value={email}
                onChange={handleInputChanging}
              />
            </div>
            <div>
              <label>Пароль</label>
              <div className={styles.passwordField}>
                <input
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Вигадайте пароль'
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
            <div>
              <label>Підтвердити пароль</label>
              <div className={styles.passwordField}>
                <input
                  name='checkPassword'
                  type={showCheckPassword ? 'text' : 'password'}
                  placeholder='Підтвердіть пароль'
                  value={checkPassword}
                  onChange={handleInputChanging}
                />
                <button
                  name='checkPassword'
                  type='button'
                  onClick={switchVision}
                  className={styles.passwordButton}
                >
                  {showCheckPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>
            <button
              className={styles.submitButton}
              type='submit'
              disabled={!isFormValid}
            >
              Зареєструватись
            </button>
          </form>
        </div>
        <div className={styles.authPrompt}>
          <h1>Уже зареєстрований?</h1>
          <h1>Заходь!</h1>
          <button
            className={styles.signIn}
            onClick={() => navigate('/sign-in')}
          >
            Вхід
          </button>
        </div>
      </div>
    </div>
  );
}
