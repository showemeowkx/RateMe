import React from 'react';
import styles from './Header.module.css';
import HomeButton from './HomeButton';
import AddProductButton from './AddProductButton';
import SearchBar from './SearchBar';
import ProfileButton from './ProfileButton';

export default function Header() {
  return (
    <div className={styles.header}>
      <HomeButton />
      <SearchBar />
      <AddProductButton />
      <ProfileButton />
    </div>
  );
}
