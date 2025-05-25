import React from 'react';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';

export default function Profile() {
  return (
    <Link to='/profile'>
      <div className={styles.profileButton}>
        <FaRegUser className={styles.profileIcon} />
      </div>
    </Link>
  );
}
