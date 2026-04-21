import './Footer.css';
import { Link } from 'react-router-dom';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="footer-brand">
          <div className="footer-brand-head">
            <div className="footer-logo">N</div>
            <div>
              <div className="footer-brand-title">Noda</div>
              <div className="footer-brand-sub">Платформа 3D и 2D ресурсов</div>
            </div>
          </div>
          <p className="footer-brand-text">
            Noda — место, где авторы публикуют модели и иллюстрации,
            а пользователи находят вдохновение. Делитесь работами, собирайте
            отклик сообщества и отслеживайте аналитику в личном кабинете.
          </p>
        </div>

        <div className="footer-col">
          <h4>Платформа</h4>
          <Link to="/">Главная</Link>
          <Link to="/?type=models">3D модели</Link>
          <Link to="/?type=images">2D изображения</Link>
          <Link to="/upload">Загрузить</Link>
        </div>

        <div className="footer-col">
          <h4>Сообщество</h4>
          <a href="#" onClick={(e) => e.preventDefault()}>Правила</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Гайд для авторов</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Лицензии</a>
          <a href="#" onClick={(e) => e.preventDefault()}>FAQ</a>
        </div>

        <div className="footer-col">
          <h4>Компания</h4>
          <a href="#" onClick={(e) => e.preventDefault()}>О нас</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Блог</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Контакты</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Пресс-кит</a>
        </div>

        <div className="footer-col">
          <h4>Связаться</h4>
          <a href="mailto:hello@noda.app">hello@noda.app</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Telegram</a>
          <a href="#" onClick={(e) => e.preventDefault()}>Discord</a>
          <a href="#" onClick={(e) => e.preventDefault()}>GitHub</a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Noda. Все права защищены.</span>
        <div className="footer-legal">
          <a href="#" onClick={(e) => e.preventDefault()}>Политика конфиденциальности</a>
          <span className="footer-dot">·</span>
          <a href="#" onClick={(e) => e.preventDefault()}>Условия использования</a>
          <span className="footer-dot">·</span>
          <a href="#" onClick={(e) => e.preventDefault()}>Cookies</a>
        </div>
      </div>
    </footer>
  );
}
