import React, { useState } from 'react';
import styles from './AddProduct.module.css';
import { addProduct } from '../../services/products/productsFetch';
import AddProductDto from '../../services/products/dto/addProductDto';
import HomeButton from '../../components/HomeButton';
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';
import { CATEGORY_OPTIONS } from '../../services/categories/categoriesObj';

export default function AddProduct() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [categorySlug, setCategorySlug] = useState(
    Object.keys(CATEGORY_OPTIONS)[0]
  );
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState([]);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setPreview(URL.createObjectURL(uploadedFile));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productDto = new AddProductDto(
        name,
        description,
        file,
        categorySlug
      );
      await addProduct(productDto);
      navigate('/');
    } catch (err) {
      setError([err.message || 'Помилка додавання']);
    }
  };

  const isFormValid =
    name.trim() && description.trim() && categorySlug.trim() && file;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <main style={{ flex: 1 }}>
        <div className={styles.homeButton}>
          <HomeButton />
        </div>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1>Додати товар</h1>

            {error.length ? (
              error.map((err, index) => (
                <h5 key={index} className={styles.error}>
                  {err}
                </h5>
              ))
            ) : (
              <></>
            )}

            <div className={styles.inputs}>
              <div className={styles.imageUpload}>
                <label className={styles.imageLabel}>
                  {preview ? (
                    <img
                      src={preview}
                      alt='Preview'
                      className={styles.previewImage}
                    />
                  ) : (
                    <span>Натисни, щоб обрати фото</span>
                  )}
                  <input
                    type='file'
                    accept='.jpg, .jpeg, .png'
                    onChange={handleImageUpload}
                    hidden
                  />
                </label>
              </div>

              <div className={styles.rightSide}>
                <div>
                  <label>Назва товару</label>
                  <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Назва'
                  />
                </div>

                <div
                  styles={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div>
                    <label>Опис</label>
                  </div>
                  <div>
                    <textarea
                      value={description}
                      className={styles.description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder='Опис'
                    />
                  </div>
                </div>

                <div
                  styles={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div>
                    <label>Категорія</label>
                  </div>
                  <div>
                    <select
                      className={styles.dropdown}
                      value={CATEGORY_OPTIONS[categorySlug]}
                      onChange={(e) => {
                        const selectedValue = e.target.value;
                        const selectedKey = Object.keys(CATEGORY_OPTIONS).find(
                          (key) => CATEGORY_OPTIONS[key] === selectedValue
                        );
                        setCategorySlug(selectedKey);
                      }}
                    >
                      {Object.values(CATEGORY_OPTIONS).map((label) => (
                        <option key={label} value={label}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type='submit' disabled={!isFormValid}>
                  Додати товар
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
