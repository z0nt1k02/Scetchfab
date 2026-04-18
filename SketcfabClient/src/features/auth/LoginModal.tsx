import { useState } from 'react';
import './auth.css';
import { login } from '../../api/authApi';
import { useAuth } from './AuthContext';

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(credentials);
      refresh();
      onClose();
    } catch {
      setError('Неверный email или пароль');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Войти</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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
