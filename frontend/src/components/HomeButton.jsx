import React from 'react';
import styles from './HomeButton.module.css';
import { Link } from 'react-router-dom';

export default function HomeButton() {
  return (
    <div>
      <Link to='/'>
        <button className={styles.homeButton}>
          <img className={styles.homeImg} src='../logo.png' alt='RateMe' />
        </button>
      </Link>
    </div>
  );
}
