import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import HomePage from './pages/HomePage/HomePage';
import ModelPage from './pages/ModelPage/ModelPage';
import UploadPage from './pages/UploadPage/UploadPage';

export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/model/:id" element={<ModelPage />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </>
  );
}
