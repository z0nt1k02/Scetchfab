import './UploadPage.css';
import { useEffect, useMemo, useState, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useFBX } from '@react-three/drei';
import axios from 'axios';
import { createModel } from '../../api/modelsApi';

const MODEL_EXTENSIONS = ['fbx', 'zip'] as const;
const IMAGE_EXTENSIONS = ['png', 'jpg', 'jpeg'] as const;

type ModelExt = (typeof MODEL_EXTENSIONS)[number];

function getExtension(filename: string): string {
  return /\.([a-zA-Z0-9]+)$/.exec(filename)?.[1]?.toLowerCase() ?? '';
}

function FBXPreview({ url }: { url: string }) {
  const fbx = useFBX(url);
  return <primitive object={fbx} scale={0.01} />;
}

export default function UploadPage() {
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const modelExt = modelFile ? (getExtension(modelFile.name) as ModelExt) : null;

  const previewUrl = useMemo(() => {
    if (!modelFile || modelExt !== 'fbx') return null;
    return URL.createObjectURL(modelFile);
  }, [modelFile, modelExt]);

  useEffect(() => {
    if (!previewUrl) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const handleModelPick = (file: File | null) => {
    setFileError('');
    if (!file) {
      setModelFile(null);
      return;
    }
    const ext = getExtension(file.name);
    if (!MODEL_EXTENSIONS.includes(ext as ModelExt)) {
      setFileError('Поддерживаются только .fbx или .zip');
      return;
    }
    setModelFile(file);
  };

  const resetModel = () => {
    setModelFile(null);
    setImageFile(null);
    setTitle('');
    setFileError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelFile || !imageFile || !title) return;

    const imgExt = getExtension(imageFile.name);
    if (!IMAGE_EXTENSIONS.includes(imgExt as (typeof IMAGE_EXTENSIONS)[number])) {
      alert('Изображение должно быть .png или .jpeg');
      return;
    }

    setSubmitting(true);
    try {
      const uploadUrl = await createModel(title, modelFile.name);
      await axios.put(uploadUrl, modelFile, {
        headers: { 'Content-Type': 'application/octet-stream' },
      });
      navigate('/');
    } catch (error) {
      console.error('Ошибка при загрузке:', error);
      alert('Не удалось загрузить модель');
    } finally {
      setSubmitting(false);
    }
  };

  if (!modelFile) {
    return (
      <main className="upload-stage-picker">
        <h1 className="upload-title">Загрузить модель</h1>
        <label className="upload-dropzone">
          <input
            type="file"
            accept=".fbx,.zip"
            onChange={(e) => handleModelPick(e.target.files?.[0] ?? null)}
          />
          <div className="upload-dropzone-icon">+</div>
          <div className="upload-dropzone-title">
            Выберите модель (.fbx) или архив (.zip)
          </div>
          <div className="upload-dropzone-hint">
            Редактор откроется после выбора файла
          </div>
        </label>
        {fileError && <div className="upload-file-error">{fileError}</div>}
        <button
          type="button"
          className="upload-cancel-link"
          onClick={() => navigate('/')}
        >
          Отмена
        </button>
      </main>
    );
  }

  return (
    <main className="editor-stage">
      <div className="editor-header">
        <h1 className="upload-title">Редактор модели</h1>
        <button type="button" className="editor-change" onClick={resetModel}>
          Сменить файл
        </button>
      </div>

      <div className="editor-layout">
        <div className="editor-preview">
          {previewUrl ? (
            <Canvas camera={{ position: [0, 1, 3] }}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={1} />
              <OrbitControls />
              <Suspense fallback={null}>
                <FBXPreview url={previewUrl} />
              </Suspense>
            </Canvas>
          ) : (
            <div className="editor-preview-placeholder">
              <div className="editor-preview-placeholder-icon">ZIP</div>
              <div>Предпросмотр .zip архивов недоступен</div>
              <div className="editor-preview-placeholder-sub">
                {modelFile.name}
              </div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="editor-form">
          <div className="editor-file-info">
            <span className="editor-file-label">Модель</span>
            <span className="editor-file-name">{modelFile.name}</span>
          </div>

          <label className="editor-field">
            <span>Название</span>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название модели"
              required
            />
          </label>

          <div className="editor-field">
            <span>Превью (.png, .jpeg)</span>
            <label className="file-upload">
              <input
                type="file"
                accept=".png,.jpeg,.jpg"
                onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                required
              />
              <span className="file-button">
                {imageFile ? imageFile.name : 'Выберите файл'}
              </span>
            </label>
          </div>

          <div className="actions">
            <button
              type="submit"
              className="send-button"
              disabled={submitting || !imageFile || !title}
            >
              {submitting ? 'Загрузка...' : 'Сохранить'}
            </button>
            <button
              type="button"
              className="send-button cancel"
              onClick={() => navigate('/')}
              disabled={submitting}
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
