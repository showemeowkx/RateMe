import React from 'react';
import HomeButton from '../HomeButton';
import AddProduct from '../AddProduct';
import SearchBar from '../SearchBar';
import Profile from '../Profile';

export default function Header() {
  return (
    <div>
      <HomeButton />
      <SearchBar />
      <AddProduct />
      <Profile />
    </div>
  );
}
