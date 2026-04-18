import { useState } from 'react';
import './auth.css';
import { register, login } from '../../api/authApi';
import { useAuth } from './AuthContext';

interface Props {
  onClose: () => void;
}

export default function RegisterModal({ onClose }: Props) {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    nickname: '',
  });
  const [error, setError] = useState('');
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(credentials);
      await login({ email: credentials.email, password: credentials.password });
      refresh();
      onClose();
    } catch {
      setError('Ошибка при регистрации');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Регистрация</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={credentials.email}
            onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Никнейм"
            value={credentials.nickname}
            onChange={(e) => setCredentials({ ...credentials, nickname: e.target.value })}
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
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
}
