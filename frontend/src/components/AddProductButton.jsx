import { useState, useEffect } from 'react';
import styles from './AddProductButton.module.css';
import { FaPlusSquare } from 'react-icons/fa';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

export default function AddProductButton() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = () => {
    const token = Cookies.get('token');
    const navigation = token ? '/add-product' : '/sign-up';
    navigate(navigation);
  };

  return (
    <button className={styles.addButton} onClick={handleNavigation}>
      <FaPlusSquare className={styles.addIcon} />
      {!isMobile && <>&nbsp; Створити товар</>}
    </button>
  );
}
