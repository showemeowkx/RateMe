import React from 'react';
import styles from './ProfileButton.module.css';
import { useNavigate } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';
import Cookies from 'js-cookie';

export default function ProfileButton() {
  const navigate = useNavigate();

  const handleNavigation = () => {
    const token = Cookies.get('token');
    const navigation = token ? '/profile' : '/sign-up';
    navigate(navigation);
  };
  return (
    <button className={styles.profileButton} onClick={handleNavigation}>
      <FaRegUser className={styles.profileIcon} />
    </button>
  );
}
