import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { createImage } from '../../api/imageAssetsApi';
import { addUserUpload } from '../../api/interactionsApi';
import { useAuth } from '../../features/auth/AuthContext';
import { MODEL_CATEGORIES, IMAGE_EXTENSIONS } from '../../types';

function getExtension(name: string): string {
  return /\.([a-zA-Z0-9]+)$/.exec(name)?.[1]?.toLowerCase() ?? '';
}

const MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
  bmp: 'image/bmp',
};

interface Props {
  onBack: () => void;
}

export default function UploadImageForm({ onBack }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handlePick = (f: File | null) => {
    setFileError('');
    if (!f) {
      setFile(null);
      return;
    }
    const ext = getExtension(f.name);
    if (!(IMAGE_EXTENSIONS as readonly string[]).includes(ext)) {
      setFileError(`Поддерживаются: ${IMAGE_EXTENSIONS.join(', ')}`);
      return;
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setSubmitting(true);
    try {
      const tags = tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);
      const res = await createImage(title.trim(), file.name, {
        category: category || null,
        tags,
      });

      const ext = getExtension(file.name);
      const contentType = MIME_BY_EXT[ext] ?? 'application/octet-stream';
      await axios.put(res.uploadUrl, file, {
        headers: { 'Content-Type': contentType },
      });

      if (user) addUserUpload(user.id, res.id);
      navigate('/');
    } catch (err) {
      console.error('Ошибка при загрузке изображения:', err);
      alert('Не удалось загрузить изображение');
    } finally {
      setSubmitting(false);
    }
  };

  if (!file) {
    return (
      <main className="upload-stage-picker">
        <h1 className="upload-title">Загрузить изображение</h1>
        <label className="upload-dropzone">
          <input
            type="file"
            accept={IMAGE_EXTENSIONS.map((e) => `.${e}`).join(',')}
            onChange={(e) => handlePick(e.target.files?.[0] ?? null)}
          />
          <div className="upload-dropzone-icon">+</div>
          <div className="upload-dropzone-title">
            Выберите изображение
          </div>
          <div className="upload-dropzone-hint">
            {IMAGE_EXTENSIONS.join(', ')}
          </div>
        </label>
        {fileError && <div className="upload-file-error">{fileError}</div>}
        <button type="button" className="upload-cancel-link" onClick={onBack}>
          Назад
        </button>
      </main>
    );
  }

  return (
    <main className="upload-stage-picker">
      <h1 className="upload-title">Загрузить изображение</h1>

      <div className="upload-image-preview">
        {previewUrl && <img src={previewUrl} alt={file.name} />}
      </div>

      <form onSubmit={handleSubmit} className="upload-image-form">
        <label className="editor-field">
          <span>Название</span>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Введите название"
            required
          />
        </label>

        <label className="editor-field">
          <span>Категория</span>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="editor-select"
          >
            <option value="">— без категории —</option>
            {MODEL_CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>

        <label className="editor-field">
          <span>Теги (через запятую)</span>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="art, pixel, illustration"
          />
        </label>

        <div className="actions">
          <button
            type="submit"
            className="send-button"
            disabled={submitting || !title.trim()}
          >
            {submitting ? 'Загрузка...' : 'Сохранить'}
          </button>
          <button
            type="button"
            className="send-button cancel"
            onClick={() => setFile(null)}
            disabled={submitting}
          >
            Выбрать другой файл
          </button>
        </div>
      </form>
    </main>
  );
}
