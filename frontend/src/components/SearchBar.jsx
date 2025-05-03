import React from 'react';
import { FaSearch } from 'react-icons/fa';

export default function SearchBar() {
  return (
    <div>
      <FaSearch />
      <input type='text' placeholder='Search...' />
    </div>
  );
}
