import React from 'react';
import styles from './Profile.module.css';
import { Link } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';

export default function Profile() {
  return (
    <div>
      <Link to='/profile'>
        <div>
          <button className={styles.profileButton}>
            <FaRegUser className={styles.profileIcon} />
          </button>
        </div>
      </Link>
    </div>
  );
}
