import React from 'react';
import styles from './Header.module.css';
import HomeButton from './HomeButton';
import AddProduct from './AddProduct';
import SearchBar from './SearchBar';
import Profile from './Profile';

export default function Header() {
  return (
    <div className={styles.header}>
      <HomeButton />
      <SearchBar />
      <AddProduct />
      <Profile />
    </div>
  );
}
