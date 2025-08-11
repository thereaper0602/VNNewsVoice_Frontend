import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/layouts/Header';
import Home from './components/Home';
import Footer from './components/layouts/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { createContext, useState } from 'react';
import ArticleDetail from './components/ArticleDetail';
import Register from './components/Register';
import Login from './components/Login';
import { AppContextProvider } from './contexts/AppContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { SearchContextProvider } from './contexts/SearchContext';
import SearchArticle from './components/SearchArticle';
// Tạo Context để chia sẻ trạng thái tìm kiếm và danh mục

const App = () => {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <BrowserRouter>
        <AppContextProvider>
          <SearchContextProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/:slug_id" element={<ArticleDetail />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path='/search' element={<SearchArticle />} />
            </Routes>
            <Footer />
          </SearchContextProvider>
        </AppContextProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;