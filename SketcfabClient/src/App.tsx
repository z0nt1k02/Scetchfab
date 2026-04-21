import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import ModelPage from './pages/ModelPage/ModelPage';
import ImagePage from './pages/ImagePage/ImagePage';
import UploadPage from './pages/UploadPage/UploadPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import StatsPage from './pages/StatsPage/StatsPage';
import { AuthProvider } from './features/auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Header />
      <div className="app-main">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/model/:id" element={<ModelPage />} />
          <Route path="/image/:id" element={<ImagePage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/profile/stats/:kind/:id" element={<StatsPage />} />
        </Routes>
      </div>
      <Footer />
    </AuthProvider>
  );
}
