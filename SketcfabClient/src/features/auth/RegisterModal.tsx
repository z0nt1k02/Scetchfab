import { useState } from 'react';
import './auth.css';
import { register } from '../../api/authApi';

interface Props {
  onClose: () => void;
}

export default function RegisterModal({ onClose }: Props) {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await register(credentials);
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
          <button type="submit">Зарегистрироваться</button>
        </form>
      </div>
    </div>
  );
}
