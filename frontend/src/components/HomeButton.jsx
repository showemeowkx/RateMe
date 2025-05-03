import React from 'react';
import { Link } from 'react-router-dom';

export default function HomeButton() {
  return (
    <div>
      <Link to='/'>
        <button>
          <img src='../logo.png' alt='RateMe' />
        </button>
      </Link>
    </div>
  );
}
