import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import BlogSection from './components/blog/BlogSection';
import { GalleryPage } from './pages/GalleryPage';
import { Footer } from './components/Footer';
import { Eventos } from "./pages/Eventos";
import { AdminPanel } from './pages/AdminPanel';
import { CategoryProvider } from './contexts/CategoryContext';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <CategoryProvider>
        <Router>
          <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<BlogSection />} />
                <Route path="/galeria" element={<GalleryPage />} />
                <Route path="/eventos" element={<Eventos />} />
                <Route path="/admin" element={<AdminPanel />} />
                {/* Adicione mais rotas conforme necessário */}
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
        <Toaster
          position="top-right"
          toastOptions={{
            success: {
              style: {
                background: '#10B981',
                color: 'white',
              },
            },
            error: {
              style: {
                background: '#EF4444',
                color: 'white',
              },
            },
            loading: {
              style: {
                background: '#6B7280',
                color: 'white',
              },
            },
          }}
        />
      </CategoryProvider>
    </AuthProvider>
  );
}