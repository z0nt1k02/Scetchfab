import './Header.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../../features/auth/LoginModal';
import RegisterModal from '../../features/auth/RegisterModal';
import { useAuth } from '../../features/auth/AuthContext';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header>
        <div className="header-container">
          <div className="logo-container">
            <h1 onClick={() => navigate('/')}>Noda</h1>
          </div>

          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Поиск моделей..."
            />
          </div>

          <div className="user-container">
            {user ? (
              <>
                <div className="upload-container">
                  <button onClick={() => navigate('/upload')}>Загрузить</button>
                </div>
                <button
                  className="profile-button"
                  onClick={() => navigate('/profile')}
                  title="Личный кабинет"
                >
                  <span className="profile-avatar">
                    {user.nickname.charAt(0).toUpperCase()}
                  </span>
                  <span className="profile-name">{user.nickname}</span>
                </button>
                <div className="logout-container">
                  <button onClick={handleLogout}>Выйти</button>
                </div>
              </>
            ) : (
              <>
                <div className="login-container">
                  <button onClick={() => setShowLogin(true)}>Войти</button>
                </div>
                <div className="registration-container">
                  <button onClick={() => setShowRegister(true)}>
                    Зарегистрироваться
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
