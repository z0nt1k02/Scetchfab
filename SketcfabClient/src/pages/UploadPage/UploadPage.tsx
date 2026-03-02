import './UploadPage.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createModel } from '../../api/modelsApi';

function getExtension(filename: string): string {
  return /\.([a-zA-Z0-9]+)$/.exec(filename)?.[1] ?? '';
}

export default function UploadPage() {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!modelFile || !imageFile || !title) return;

    if (getExtension(modelFile.name) !== 'fbx') {
      alert('Файл модели должен быть .fbx');
      return;
    }

    const imgExt = getExtension(imageFile.name);
    if (imgExt !== 'png' && imgExt !== 'jpeg' && imgExt !== 'jpg') {
      alert('Изображение должно быть .png или .jpeg');
      return;
    }

    try {
      // Backend returns a presigned S3 URL
      const uploadUrl = await createModel(title, modelFile.name);

      // Upload file directly to S3 (presigned URL, not through proxy)
      await axios.put(uploadUrl, modelFile, {
        headers: { 'Content-Type': 'application/octet-stream' },
      });

      navigate('/');
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
    }
  };

  return (
    <>
      <h1 className="upload-title">Загрузить модель</h1>
      <div className="inputModel-container">
        <form onSubmit={handleSubmit} className="upload-form">
          <div className="form-row">
            <div className="form-label">
              <span>Модель (.fbx)</span>
            </div>
            <label className="file-upload">
              <input
                type="file"
                accept=".fbx"
                onChange={(e) => setModelFile(e.target.files?.[0] ?? null)}
                required
              />
              <span className="file-button">Выберите файл</span>
            </label>
            <div className="file-status">
              {modelFile ? `Выбран: ${modelFile.name}` : 'Файл не выбран'}
            </div>
          </div>

          <div className="form-row">
            <div className="form-label">
              <span>
                Изображение
                <br />
                (.png, .jpeg)
              </span>
            </div>
            <label className="file-upload">
              <input
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                required
              />
              <span className="file-button">Выберите файл</span>
            </label>
            <div className="file-status">
              {imageFile ? `Выбран: ${imageFile.name}` : 'Файл не выбран'}
            </div>
          </div>

          <div className="title-row">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название модели"
              required
              className="title-input"
            />
          </div>

          <div className="actions">
            <button type="submit" className="send-button">
              Отправить
            </button>
            <button
              type="button"
              className="send-button cancel"
              onClick={() => navigate('/')}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
