import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CategoryGrid from '../../components/HomePage/CategoryGrid';

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <Header />
      <CategoryGrid categories={categories} />
      <Footer />
    </div>
  );
}
