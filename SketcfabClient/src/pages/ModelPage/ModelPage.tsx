import './ModelPage.css';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getModel } from '../../api/modelsApi';
import type { Model } from '../../types';

export default function ModelPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [model, setModel] = useState<Model | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getModel(id)
      .then(setModel)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = () => {
    if (!model?.fileUrl) return;
    const link = document.createElement('a');
    link.href = model.fileUrl;
    link.setAttribute('download', 'model.fbx');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (loading) {
    return (
      <div className="modelView-page">
        <div className="modelView-status">Загрузка...</div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="modelView-page">
        <div className="modelView-status">Модель не найдена</div>
        <button className="download-button" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="modelView-page">
      <div className="modelView-card">
        <h1 className="modelView-title">{model.title}</h1>
        <div className="modelView-meta">ID: {model.id}</div>
        <button
          className="download-button"
          onClick={handleDownload}
          disabled={!model.fileUrl}
        >
          Скачать
        </button>
      </div>
    </div>
  );
}
