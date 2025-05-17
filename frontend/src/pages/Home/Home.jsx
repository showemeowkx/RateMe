import React, { useState, useEffect } from 'react';
import Header from '../../components/HomePage/Header';
import Footer from '../../components/HomePage/Footer';
import CategoryGrid from '../../components/HomePage/CategoryGrid';

export default function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/data/categories.json')
      .then((response) => response.json())
      .then((data) => setCategories(data));
  }, []);

  return (
    <div>
      <Header />
      <CategoryGrid categories={categories} />
      <Footer />
    </div>
  );
}
