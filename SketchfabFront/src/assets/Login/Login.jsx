import { useState } from "react";
import axios from "axios";

export default function Login({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  async function loginRequest(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5185/api/authentication/login",
        { login, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      // console.log(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Login error:", error);
    }
  }
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose?.();
    }
  }

  return (
    <div className="login-overlay" onClick={handleBackdropClick}>
      <div className="login-modal">
        <h2 className="login-title">Вход</h2>
        <form className="login-form" onSubmit={loginRequest}>
          <input
            className="login-input"
            placeholder="Email"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <input
            className="login-input"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="login-submit" type="submit">
            Войти
          </button>
        </form>
        <button className="login-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
