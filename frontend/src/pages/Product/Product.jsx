import Header from '../../components/Header';
import ProductInterface from '../../components/ProductPage/ProductInterface';
import Footer from '../../components/Footer';

export default function Product() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <main style={{ flex: 1 }}>
        <ProductInterface />
      </main>
      <Footer />
    </div>
  );
}
