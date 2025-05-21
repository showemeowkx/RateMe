import { useState, useEffect } from 'react';
import styles from './AddProduct.module.css';
import { Link } from 'react-router-dom';
import { FaPlusSquare } from 'react-icons/fa';

export default function AddProduct() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 576);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 576);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div>
      <Link className={styles.link} to='/add-product'>
        <div className={styles.addContainer}>
          <button className={styles.addButton}>
            <FaPlusSquare className={styles.addIcon} />
            {!isMobile && <>&nbsp; Створити товар</>}
          </button>
        </div>
      </Link>
    </div>
  );
}
