import { useEffect, useState } from 'react';
import ImageCard from './ImageCard';
import { getImages } from '../../api/imageAssetsApi';
import { MODEL_CATEGORIES, type ImageAsset } from '../../types';

export default function ImagesGrid() {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [tag, setTag] = useState('');

  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [debouncedTag, setDebouncedTag] = useState('');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedTag(tag.trim()), 300);
    return () => clearTimeout(t);
  }, [tag]);

  useEffect(() => {
    setLoading(true);
    getImages(1, 50, {
      q: debouncedQuery || undefined,
      category: category || undefined,
      tag: debouncedTag || undefined,
    })
      .then(setImages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [debouncedQuery, category, debouncedTag]);

  const resetFilters = () => {
    setQuery('');
    setCategory('');
    setTag('');
  };

  const hasFilters = query || category || tag;

  return (
    <div className="models-page">
      <div className="models-search">
        <input
          type="text"
          className="models-search-input"
          placeholder="Поиск по названию..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="models-search-select"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Все категории</option>
          {MODEL_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          type="text"
          className="models-search-input models-search-tag"
          placeholder="Тег"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        />
        {hasFilters && (
          <button
            type="button"
            className="models-search-reset"
            onClick={resetFilters}
          >
            Сбросить
          </button>
        )}
      </div>

      {loading ? (
        <div className="models-loading">Загрузка...</div>
      ) : images.length === 0 ? (
        <div className="models-empty">
          {hasFilters ? 'Ничего не найдено' : 'Изображения не найдены'}
        </div>
      ) : (
        <div className="models-grid">
          {images.map((img) => (
            <ImageCard key={img.id} image={img} />
          ))}
        </div>
      )}
    </div>
  );
}
