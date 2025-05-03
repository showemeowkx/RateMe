import React, { useState, useEffect } from 'react';
import styles from './AddProduct.module.css';
import { Link } from 'react-router-dom';
import { FaPlusSquare } from 'react-icons/fa';

export default function AddProduct() {
  const [addingButton, setAddingButton] = useState(
    <p>
      <FaPlusSquare className={styles.addIcon} />
      &nbsp; Add product
    </p>
  );

  useEffect(() => {
    const updateAddingButton = () => {
      if (window.innerWidth < 576) {
        setAddingButton(<FaPlusSquare className={styles.addIcon} />);
      } else {
        setAddingButton(
          <p>
            <FaPlusSquare className={styles.addIcon} />
            &nbsp; Add product
          </p>
        );
      }
    };
    updateAddingButton();
    window.addEventListener('resize', updateAddingButton);

    return () => {
      window.removeEventListener('resize', updateAddingButton);
    };
  }, []);

  return (
    <div>
      <Link className={styles.link} to='/add-product'>
        <div className={styles.addContainer}>
          <button className={styles.addButton}>{addingButton}</button>
        </div>
      </Link>
    </div>
  );
}
