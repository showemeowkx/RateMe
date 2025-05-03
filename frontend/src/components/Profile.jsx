import React from 'react';
import { Link } from 'react-router-dom';
import { FaRegUser } from 'react-icons/fa';

export default function Profile() {
  return (
    <div>
      <Link to='/profile'>
        <div>
          <button>
            <FaRegUser />
          </button>
        </div>
      </Link>
    </div>
  );
}
