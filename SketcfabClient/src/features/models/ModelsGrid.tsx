import './ModelsGrid.css';
import { useState, useEffect } from 'react';
import ModelCard from './ModelCard';
import { getModels } from '../../api/modelsApi';
import type { Model } from '../../types';

export default function ModelsGrid() {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getModels()
      .then(setModels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="models-loading">Загрузка...</div>;
  }

  if (models.length === 0) {
    return <div className="models-empty">Модели не найдены</div>;
  }

  return (
    <div className="models-grid">
      {models.map((model) => (
        <ModelCard key={model.id} model={model} />
      ))}
    </div>
  );
}
