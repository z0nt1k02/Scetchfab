import './Header.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../../features/auth/LoginModal';
import RegisterModal from '../../features/auth/RegisterModal';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo-container">
            <h1 onClick={() => navigate('/')}>Sketchfab</h1>
          </div>

          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Поиск моделей..."
            />
          </div>

          <div className="user-container">
            <div className="upload-container">
              <button onClick={() => navigate('/upload')}>Загрузить</button>
            </div>
            <div className="login-container">
              <button onClick={() => setShowLogin(true)}>Войти</button>
            </div>
            <div className="registration-container">
              <button onClick={() => setShowRegister(true)}>
                Зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
