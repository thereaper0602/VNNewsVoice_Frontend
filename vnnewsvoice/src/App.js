import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Header from './components/layouts/Header';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext, useState } from 'react';
import ArticleDetail from './components/ArticleDetail';
import Register from './components/Register';
import Login from './components/Login';
import { AppContextProvider } from './contexts/AppContext';

// Tạo Context để chia sẻ trạng thái tìm kiếm và danh mục
export const SearchContext = createContext();

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  return (
    <BrowserRouter>
      <AppContextProvider>
        <SearchContext.Provider value={{ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }}>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/:slug_id" element={<ArticleDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Routes>
          <Footer />
        </SearchContext.Provider>
      </AppContextProvider>
    </BrowserRouter>
  );
}

export default App;