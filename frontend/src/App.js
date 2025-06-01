import './App.css';
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import Product from './pages/Product/Product';
import Registration from './pages/Registration/Registration';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/products' element={<Products />} />
          <Route path='/products/:id' element={<Product />} />
          <Route path='/sign-up' element={<Registration />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
