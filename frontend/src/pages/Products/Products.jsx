import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ProductsGrid from '../../components/ProductsPage/ProductsGrid';

export default function Products() {
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
        <ProductsGrid />
      </main>
      <Footer />
    </div>
  );
}
