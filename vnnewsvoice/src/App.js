import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/layouts/Header';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext, useState } from 'react';

// Tạo Context để chia sẻ trạng thái tìm kiếm và danh mục
export const SearchContext = createContext();

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  return (
    <SearchContext.Provider value={{ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </SearchContext.Provider>
  );
}

export default App;