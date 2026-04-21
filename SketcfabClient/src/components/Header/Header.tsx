import './Header.css';
import { useState } from 'react';
import { useNavigate, NavLink, useLocation } from 'react-router-dom';
import LoginModal from '../../features/auth/LoginModal';
import RegisterModal from '../../features/auth/RegisterModal';
import { useAuth } from '../../features/auth/AuthContext';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      <header className="site-header">
        <div className="header-top">
          <div className="header-container">
            <div className="logo-container" onClick={() => navigate('/')}>
              <div className="logo-mark">N</div>
              <div className="logo-text">
                <span className="logo-title">Noda</span>
                <span className="logo-sub">3D · 2D · Community</span>
              </div>
            </div>

            <nav className="header-nav" aria-label="Основная навигация">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `header-nav-link${
                    isActive && location.pathname === '/' ? ' active' : ''
                  }`
                }
              >
                Главная
              </NavLink>
              <NavLink
                to="/?type=models"
                className={() =>
                  `header-nav-link${location.search.includes('type=models') ? ' active' : ''}`
                }
              >
                3D модели
              </NavLink>
              <NavLink
                to="/?type=images"
                className={() =>
                  `header-nav-link${location.search.includes('type=images') ? ' active' : ''}`
                }
              >
                2D графика
              </NavLink>
              {user && (
                <NavLink
                  to="/profile"
                  className={({ isActive }) =>
                    `header-nav-link${isActive ? ' active' : ''}`
                  }
                >
                  Профиль
                </NavLink>
              )}
            </nav>

            <div className="search-container">
              <span className="search-icon" aria-hidden>🔍</span>
              <input
                className="search-input"
                type="text"
                placeholder="Поиск по моделям и изображениям..."
              />
            </div>

            <div className="user-container">
              {user ? (
                <>
                  <button
                    className="header-btn header-btn-primary"
                    onClick={() => navigate('/upload')}
                  >
                    Загрузить
                  </button>
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
                  <button className="header-btn header-btn-ghost" onClick={handleLogout}>
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="header-btn header-btn-ghost"
                    onClick={() => setShowLogin(true)}
                  >
                    Войти
                  </button>
                  <button
                    className="header-btn header-btn-primary"
                    onClick={() => setShowRegister(true)}
                  >
                    Зарегистрироваться
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="header-tagline">
          <div className="tagline-inner">
            <span className="tagline-badge">Новое</span>
            <span className="tagline-text">
              Публикуйте работы, собирайте лайки и следите за аналитикой в личном кабинете.
            </span>
            <button className="tagline-cta" onClick={() => navigate('/upload')}>
              Начать публикацию →
            </button>
          </div>
        </div>
      </header>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      {showRegister && <RegisterModal onClose={() => setShowRegister(false)} />}
    </>
  );
}
