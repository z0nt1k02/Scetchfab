import { useState } from 'react';
import './auth.css';
import { login } from '../../api/authApi';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(credentials);
      onClose();
    } catch {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Войти</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email / логин"
            value={credentials.login}
            onChange={(e) => setCredentials({ ...credentials, login: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
          />
          {error && <span className="modal-error">{error}</span>}
          <button type="submit">Войти</button>
        </form>
      </div>
    </div>
  );
}
