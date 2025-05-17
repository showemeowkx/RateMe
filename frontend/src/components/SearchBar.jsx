import React from 'react';
import styles from './SearchBar.module.css';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  return (
    <div className={styles.searchContainer}>
      <FaSearch className={styles.searchIcon} />
      <input
        type='text'
        className={styles.searchInput}
        placeholder='Пошук...'
      />
    </div>
  );
}
