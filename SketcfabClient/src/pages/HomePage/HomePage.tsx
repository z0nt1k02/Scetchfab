import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ModelsGrid from '../../features/models/ModelsGrid';
import ImagesGrid from '../../features/images/ImagesGrid';
import './HomePage.css';

type Tab = 'models' | 'images';

export default function HomePage() {
  const [params, setParams] = useSearchParams();
  const initial: Tab = params.get('type') === 'images' ? 'images' : 'models';
  const [tab, setTab] = useState<Tab>(initial);

  useEffect(() => {
    const t = params.get('type');
    if (t === 'images') setTab('images');
    else if (t === 'models') setTab('models');
  }, [params]);

  const switchTab = (next: Tab) => {
    setTab(next);
    const p = new URLSearchParams(params);
    p.set('type', next);
    setParams(p, { replace: true });
  };

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-text">
            <span className="home-hero-eyebrow">Сообщество авторов</span>
            <h1 className="home-hero-title">
              Открытая библиотека <span className="accent-gradient">3D и 2D</span> работ
            </h1>
            <p className="home-hero-sub">
              Делитесь моделями, иллюстрациями и идеями. Смотрите 3D-превью прямо
              в браузере, ставьте лайки и обсуждайте работы с другими авторами.
            </p>
            <div className="home-hero-cta">
              <a href="/upload" className="home-hero-btn primary">
                Загрузить работу
              </a>
              <a href="#catalog" className="home-hero-btn ghost">
                Смотреть каталог
              </a>
            </div>
          </div>
          <div className="home-hero-stats">
            <div className="home-hero-stat">
              <div className="home-hero-stat-num">3D</div>
              <div className="home-hero-stat-label">Viewer в браузере</div>
            </div>
            <div className="home-hero-stat">
              <div className="home-hero-stat-num">2D</div>
              <div className="home-hero-stat-label">Иллюстрации и арт</div>
            </div>
            <div className="home-hero-stat">
              <div className="home-hero-stat-num">∞</div>
              <div className="home-hero-stat-label">Лимитов нет</div>
            </div>
          </div>
        </div>
      </section>

      <section className="home-features">
        <div className="home-feature">
          <div className="home-feature-icon" style={{ background: 'rgba(91,108,255,0.12)', color: '#4450e8' }}>🎨</div>
          <h3>Редактор материалов</h3>
          <p>Настраивайте цвета, свет и материалы прямо в браузере.</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon" style={{ background: 'rgba(236,72,153,0.12)', color: '#db2777' }}>♥</div>
          <h3>Реакция сообщества</h3>
          <p>Лайки, комментарии и статистика по каждой работе.</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon" style={{ background: 'rgba(34,197,94,0.12)', color: '#16a34a' }}>📊</div>
          <h3>Аналитика автора</h3>
          <p>Смотрите метрики каждой работы в личном кабинете.</p>
        </div>
        <div className="home-feature">
          <div className="home-feature-icon" style={{ background: 'rgba(234,179,8,0.14)', color: '#b45309' }}>⚡</div>
          <h3>Быстрая загрузка</h3>
          <p>Прямая загрузка файлов в облачное хранилище.</p>
        </div>
      </section>

      <section className="home-catalog" id="catalog">
        <div className="home-catalog-head">
          <div>
            <h2 className="home-section-title">Каталог</h2>
            <p className="home-section-sub">
              Переключайтесь между 3D-моделями и 2D-иллюстрациями.
            </p>
          </div>
          <div className="home-tabs">
            <button
              className={`home-tab${tab === 'models' ? ' active' : ''}`}
              onClick={() => switchTab('models')}
            >
              3D модели
            </button>
            <button
              className={`home-tab${tab === 'images' ? ' active' : ''}`}
              onClick={() => switchTab('images')}
            >
              2D изображения
            </button>
          </div>
        </div>
        {tab === 'models' ? <ModelsGrid /> : <ImagesGrid />}
      </section>
    </main>
  );
}
