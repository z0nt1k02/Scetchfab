import { useState } from "react";
import axios from "axios";

export default function Registration({ isOpen, onClose }) {
  if (!isOpen) return null;
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  async function registrationRequest(e) {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5185/api/authentication/registration",
        { login, password },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
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
        <h2 className="login-title">Регистрация</h2>
        <form className="login-form" onSubmit={registrationRequest}>
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
          <input
            className="login-input"
            placeholder="Никнейм"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
          <button className="login-submit" type="submit">
            Зарегистрироваться
          </button>
        </form>
        <button className="login-close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
