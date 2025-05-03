import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlusSquare } from 'react-icons/fa';

export default function AddProduct() {
  const [addingButton, setAddingButton] = useState(
    <p>
      <FaPlusSquare />
      &nbsp; Add product
    </p>
  );

  useEffect(() => {
    const updateAddingButton = () => {
      if (window.innerWidth < 576) {
        setAddingButton(<FaPlusSquare />);
      } else {
        setAddingButton(
          <p>
            <FaPlusSquare />
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
      <Link to='/add-product'>
        <div>
          <button>{addingButton}</button>
        </div>
      </Link>
    </div>
  );
}
