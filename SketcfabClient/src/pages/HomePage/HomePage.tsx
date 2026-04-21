import { useState } from 'react';
import ModelsGrid from '../../features/models/ModelsGrid';
import ImagesGrid from '../../features/images/ImagesGrid';
import './HomePage.css';

type Tab = 'models' | 'images';

export default function HomePage() {
  const [tab, setTab] = useState<Tab>('models');

  return (
    <main>
      <div className="home-tabs">
        <button
          className={`home-tab${tab === 'models' ? ' active' : ''}`}
          onClick={() => setTab('models')}
        >
          3D модели
        </button>
        <button
          className={`home-tab${tab === 'images' ? ' active' : ''}`}
          onClick={() => setTab('images')}
        >
          2D изображения
        </button>
      </div>
      {tab === 'models' ? <ModelsGrid /> : <ImagesGrid />}
    </main>
  );
}
