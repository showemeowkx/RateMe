import { useState } from 'react';
import styles from './SearchBar.module.css';
import { FaSearch } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';

export default function SearchBar() {
  const [searchContent, setSearchContent] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchingChange = (e) => {
    setSearchContent(e.target.value);
  };

  const clearSearch = () => {
    setSearchContent('');
  };

  const handleEnterDown = (e) => {
    if (e.key === 'Enter' && searchContent.trim()) {
      clearSearch();
      const encoded = encodeURIComponent(searchContent.trim());
      location.pathname === '/products'
        ? navigate(`/products?search=${encoded}`, { replace: true })
        : navigate(`/products?search=${encoded}`);
    }
  };

  return (
    <div className={styles.searchContainer}>
      <FaSearch className={styles.searchIcon} />
      <input
        type='text'
        className={styles.searchInput}
        placeholder='Пошук...'
        value={searchContent}
        onChange={handleSearchingChange}
        onKeyDown={handleEnterDown}
      />
    </div>
  );
}
