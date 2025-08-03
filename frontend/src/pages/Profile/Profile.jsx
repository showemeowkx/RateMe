import { useState, useEffect } from 'react';
import { getProfile } from '../../services/profile/getProfile';
import HomeButton from '../../components/HomeButton';
import Loader from '../../components/Loader';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { FaCircleXmark } from 'react-icons/fa6';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';
import Footer from '../../components/Footer';
import Switch from './SwitchButton';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showCheckPassword, setShowCheckPassword] = useState(false);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [showReviews, setShowReviews] = useState(false);

  const handleInputChanging = (e) => {
    const { name, value } = e.target;

    if (name === 'username') setUsername(value);
    if (name === 'name') setName(value);
    if (name === 'email') setEmail(value);
    if (name === 'password') setPassword(value);
    if (name === 'checkPassword') setCheckPassword(value);
  };

  useEffect(() => {
    getProfile()
      .then((data) => {
        setProfile(data);
        setFile(data.imagePath);
        setPreview(data.imagePath);
        setUsername(data.username);
        setName(data.name);
        setEmail(data.email);
      })
      .finally(() => setLoading(false));
  }, []);

  const switchVision = (e) => {
    const { name } = e.currentTarget;
    if (name === 'password') setShowPassword((previous) => !previous);
    if (name === 'checkPassword') setShowCheckPassword((previous) => !previous);
  };

  const handleImageUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const isFormValid =
    username.trim() &&
    name.trim() &&
    email.trim() &&
    (username.trim() !== profile.username ||
      name.trim() !== profile.name ||
      email.trim() !== profile.email ||
      file !== profile.imagePath ||
      (password &&
        checkPassword &&
        password.trim() !== profile.password &&
        password === checkPassword));

  const handleProfileStatistics = () => {
    setShowReviews(!showReviews);
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <div style={{ flex: 1 }}>
        {loading ? (
          <Loader />
        ) : (
          <main>
            <div className={styles.homeButton}>
              <HomeButton />
            </div>

            <div className={styles.profile}>
              <div>
                <h2>Особиста інформація</h2>
                <form className={styles.form}>
                  <div className={styles.imageUpload}>
                    <label>
                      <img
                        src={preview}
                        alt='user_default'
                        className={styles.previewImage}
                      />
                      <input
                        type='file'
                        accept='.jpg, .jpeg, .png'
                        onChange={handleImageUpload}
                        hidden
                      />
                    </label>
                  </div>
                  <div className={styles.inputs}>
                    <div>
                      <label>Юзернейм</label>
                      <input
                        name='username'
                        type='text'
                        placeholder='Зміни юзернейм'
                        value={username}
                        onChange={handleInputChanging}
                      />
                    </div>
                    <div>
                      <label>Ім'я</label>
                      <input
                        name='name'
                        type='text'
                        placeholder='Зміни ім`я'
                        value={name}
                        onChange={handleInputChanging}
                      />
                    </div>
                    <div>
                      <label>Електронна пошта</label>
                      <input
                        name='email'
                        type='email'
                        placeholder='Зміни електронну пошту'
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
                          placeholder='Зміни пароль'
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
                          placeholder='Підтверди змінений пароль'
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
                      Змінити профіль
                    </button>
                  </div>
                </form>
              </div>
              <div>
                <Switch
                  isOn={showReviews}
                  handleToggle={() => setShowReviews(!showReviews)}
                />
                {showReviews ? (
                  <div>
                    <div className={styles.rightSideButtons}>
                      {profile.reviews.map((review) => (
                        <Link
                          to={`/products/${review.item.id}`}
                          key={review.id}
                          className={styles.itemButton}
                        >
                          <div className={styles.reviewMark}>
                            {review.isPositive ? (
                              <IoCheckmarkCircle />
                            ) : (
                              <FaCircleXmark />
                            )}
                          </div>
                          {review.item.name.length > 25
                            ? `${review.item.name.slice(0, 25)}...`
                            : review.item.name}{' '}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className={styles.rightSideButtons}>
                      {profile.items.map((item) => (
                        <Link
                          to={`/products/${item.id}`}
                          key={item.id}
                          className={styles.itemButton}
                        >
                          <div>
                            <img
                              src={item.imagePath}
                              alt={item.name[0]}
                              className={styles.itemImg}
                            />
                          </div>
                          <div>
                            {item.name.length > 25
                              ? `${item.name.slice(0, 25)}...`
                              : item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        )}
      </div>
      <Footer />
    </div>
  );
}
