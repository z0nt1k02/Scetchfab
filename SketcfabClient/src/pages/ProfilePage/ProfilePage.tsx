import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <h2>Вы не авторизованы</h2>
          <p>Войдите в аккаунт, чтобы открыть личный кабинет.</p>
          <button onClick={() => navigate('/')}>На главную</button>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <div className="profile-identity">
            <h1>{user.nickname}</h1>
            {user.role && <span className="profile-role">{user.role}</span>}
          </div>
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <span className="profile-field-label">ID</span>
            <span className="profile-field-value">{user.id}</span>
          </div>
          <div className="profile-field">
            <span className="profile-field-label">Никнейм</span>
            <span className="profile-field-value">{user.nickname}</span>
          </div>
          {user.role && (
            <div className="profile-field">
              <span className="profile-field-label">Роль</span>
              <span className="profile-field-value">{user.role}</span>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="profile-upload" onClick={() => navigate('/upload')}>
            Загрузить модель
          </button>
          <button className="profile-logout" onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </main>
  );
}
