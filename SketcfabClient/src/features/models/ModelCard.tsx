import './ModelCard.css';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import type { Model } from '../../types';

function FBXModel({ url }: { url: string }) {
  const fbx = useLoader(FBXLoader, url);
  return <primitive object={fbx} scale={0.01} />;
}

interface Props {
  model: Model;
}

export default function ModelCard({ model }: Props) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const show3D = hovered && !!model.fileUrl;
  const isZipModel = (model.modelName ?? '').toLowerCase().endsWith('.zip');

  return (
    <div
      className="modelCard-container"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="modelCard-image">
        {show3D && !isZipModel ? (
          <Canvas>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <OrbitControls />
            <Suspense fallback={null}>
              <FBXModel url={model.fileUrl} />
            </Suspense>
          </Canvas>
        ) : model.previewUrl ? (
          <img
            className="modelCard-preview"
            src={model.previewUrl}
            alt={model.title}
            loading="lazy"
          />
        ) : (
          <div className="modelCard-placeholder">Нет превью</div>
        )}
        {model.category && (
          <span className="modelCard-category">{model.category}</span>
        )}
      </div>
      {model.tags && model.tags.length > 0 && (
        <div className="modelCard-tags">
          {model.tags.slice(0, 3).map((t) => (
            <span key={t} className="modelCard-tag">#{t}</span>
          ))}
          {model.tags.length > 3 && (
            <span className="modelCard-tag">+{model.tags.length - 3}</span>
          )}
        </div>
      )}
      <div className="modelCard-stats">
        <span className="modelCard-stat" title="Лайки">♥ {model.likeCount ?? 0}</span>
        <span className="modelCard-stat" title="Просмотры">👁 {model.viewCount ?? 0}</span>
        <span className="modelCard-stat" title="Скачивания">⬇ {model.downloadCount ?? 0}</span>
        <span className="modelCard-stat" title="Комментарии">💬 {model.commentCount ?? 0}</span>
      </div>
      <button className="button-title" onClick={() => navigate(`/model/${model.id}`)}>
        {model.title || 'Модель'}
      </button>
    </div>
  );
}
