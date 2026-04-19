import './ModelCard.css';
import { Suspense } from 'react';
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

  return (
    <div className="modelCard-container">
      <div className="modelCard-image">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 0]} intensity={1} />
          <OrbitControls />
          <Suspense fallback={null}>
            {model.fileUrl && <FBXModel url={model.fileUrl} />}
          </Suspense>
        </Canvas>
      </div>
      <button className="button-title" onClick={() => navigate(`/model/${model.id}`)}>
        {model.title || 'Модель'}
      </button>
    </div>
  );
}
