import './ImageCard.css';
import { useNavigate } from 'react-router-dom';
import type { ImageAsset } from '../../types';

interface Props {
  image: ImageAsset;
}

export default function ImageCard({ image }: Props) {
  const navigate = useNavigate();

  return (
    <div className="imageCard-container">
      <div
        className="imageCard-image"
        onClick={() => navigate(`/image/${image.id}`)}
      >
        {image.fileUrl ? (
          <img
            className="imageCard-preview"
            src={image.fileUrl}
            alt={image.title}
            loading="lazy"
          />
        ) : (
          <div className="imageCard-placeholder">Нет превью</div>
        )}
        {image.category && (
          <span className="imageCard-category">{image.category}</span>
        )}
      </div>

      {image.tags.length > 0 && (
        <div className="imageCard-tags">
          {image.tags.slice(0, 3).map((t) => (
            <span key={t} className="imageCard-tag">#{t}</span>
          ))}
          {image.tags.length > 3 && (
            <span className="imageCard-tag">+{image.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="imageCard-stats">
        <span className="imageCard-stat" title="Просмотры">👁 {image.viewCount}</span>
        <span className="imageCard-stat" title="Скачивания">⬇ {image.downloadCount}</span>
        <span className="imageCard-stat" title="Лайки">♥ {image.likeCount}</span>
        <span className="imageCard-stat" title="Комментарии">💬 {image.commentCount}</span>
      </div>

      <button
        className="button-title"
        onClick={() => navigate(`/image/${image.id}`)}
      >
        {image.title || 'Изображение'}
      </button>
    </div>
  );
}
