import './ModelPage.css';
import { useState, useEffect, Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useFBX } from '@react-three/drei';
import { getModel } from '../../api/modelsApi';

function FBXModel({ url }: { url: string }) {
  const fbx = useFBX(url);
  return <primitive object={fbx} scale={0.01} />;
}

export default function ModelPage() {
  const { id } = useParams<{ id: string }>();
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getModel(id)
      .then((model) => setFileUrl(model.fileUrl))
      .catch(console.error);
  }, [id]);

  const handleDownload = () => {
    if (!fileUrl) return;
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', 'model.fbx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="modelView-page">
      <div className="modelView-container">
        <Canvas>
          <ambientLight intensity={0.5} />
          <directionalLight position={[0, 0, 0]} intensity={1} />
          <OrbitControls />
          <Suspense fallback={null}>
            {fileUrl && <FBXModel url={fileUrl} />}
          </Suspense>
        </Canvas>
      </div>
      <button
        className="download-button"
        onClick={handleDownload}
        disabled={!fileUrl}
      >
        Скачать
      </button>
    </div>
  );
}
