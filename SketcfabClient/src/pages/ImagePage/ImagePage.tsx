import '../ModelPage/ModelPage.css';
import './ImagePage.css';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  getImage,
  incrementImageView,
  incrementImageDownload,
} from '../../api/imageAssetsApi';
import {
  getImageLikeState,
  toggleImageLike,
  getImageComments,
  addImageComment,
  deleteImageComment,
} from '../../api/imageInteractionsApi';
import { useAuth } from '../../features/auth/AuthContext';
import LoginModal from '../../features/auth/LoginModal';
import type { ImageAsset, Comment } from '../../types';

export default function ImagePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [image, setImage] = useState<ImageAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewCount, setViewCount] = useState(0);
  const [downloadCount, setDownloadCount] = useState(0);

  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');

  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getImage(id)
      .then((img) => {
        setImage(img);
        setViewCount(img.viewCount + 1);
        setDownloadCount(img.downloadCount);
      })
      .catch((err) => {
        console.error('getImage failed:', err);
      })
      .finally(() => setLoading(false));
    incrementImageView(id);
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getImageLikeState(id, user?.id ?? null)
      .then((state) => {
        if (cancelled) return;
        setLikeCount(state.count);
        setLiked(state.liked);
      })
      .catch(console.error);
    getImageComments(id)
      .then((list) => {
        if (!cancelled) setComments(list);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, [id, user?.id]);

  const handleDownload = async () => {
    if (!image?.fileUrl || !id) return;
    try {
      const resp = await fetch(image.fileUrl);
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', image.fileName.replace(/^[0-9a-f-]+_/, ''));
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setDownloadCount((c) => c + 1);
      incrementImageDownload(id);
    } catch (err) {
      console.error('download failed', err);
    }
  };

  const requireAuth = (): boolean => {
    if (user) return true;
    setShowLogin(true);
    return false;
  };

  const handleLike = async () => {
    if (!id || !requireAuth() || !user) return;
    try {
      const next = await toggleImageLike(id, user.id);
      setLikeCount(next.count);
      setLiked(next.liked);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !requireAuth() || !user) return;
    const text = commentText.trim();
    if (!text) return;
    try {
      await addImageComment(id, user.id, user.nickname, text);
      const list = await getImageComments(id);
      setComments(list);
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!id || !user) return;
    const ok = await deleteImageComment(commentId, user.id);
    if (ok) {
      const list = await getImageComments(id);
      setComments(list);
    }
  };

  if (loading) {
    return (
      <div className="imageView-page">
        <div className="imageView-status">Загрузка...</div>
      </div>
    );
  }

  if (!image) {
    return (
      <div className="imageView-page">
        <div className="imageView-status">Изображение не найдено</div>
        <button className="download-button" onClick={() => navigate('/')}>
          На главную
        </button>
      </div>
    );
  }

  return (
    <div className="imageView-page">
      <div className="imageView-card">
        <h1 className="imageView-title">{image.title}</h1>

        <div className="imageView-stats">
          <span className="stat-chip" title="Просмотры">👁 {viewCount}</span>
          <span className="stat-chip" title="Скачивания">⬇ {downloadCount}</span>
          <span className="stat-chip" title="Комментарии">💬 {comments.length}</span>
        </div>

        {(image.category || image.tags.length > 0) && (
          <div className="imageView-chips">
            {image.category && (
              <span className="chip chip-category">{image.category}</span>
            )}
            {image.tags.map((t) => (
              <span key={t} className="chip chip-tag">#{t}</span>
            ))}
          </div>
        )}

        <div className="imageView-frame">
          <img src={image.fileUrl} alt={image.title} />
        </div>

        <div className="imageView-meta">
          Автор: <strong>{image.creatorName}</strong>
          <span className="imageView-date">
            {new Date(image.createdAt).toLocaleString()}
          </span>
        </div>

        <div className="imageView-actions">
          <button
            className="download-button"
            onClick={handleDownload}
            disabled={!image.fileUrl}
          >
            Скачать
          </button>
          <button
            className={`like-button${liked ? ' liked' : ''}`}
            onClick={handleLike}
            title={user ? 'Поставить лайк' : 'Войдите, чтобы поставить лайк'}
          >
            <span className="like-icon">{liked ? '♥' : '♡'}</span>
            <span className="like-count">{likeCount}</span>
          </button>
        </div>
      </div>

      <div className="imageView-card comments-card">
        <h2 className="comments-title">Комментарии ({comments.length})</h2>

        {user ? (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <textarea
              className="comment-input"
              placeholder="Оставьте комментарий..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
            />
            <button
              className="download-button"
              type="submit"
              disabled={!commentText.trim()}
            >
              Отправить
            </button>
          </form>
        ) : (
          <div className="comment-auth-prompt">
            <span>Войдите, чтобы оставить комментарий</span>
            <button className="download-button" onClick={() => setShowLogin(true)}>
              Войти
            </button>
          </div>
        )}

        <ul className="comment-list">
          {comments.length === 0 && (
            <li className="comment-empty">Пока нет комментариев</li>
          )}
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <div className="comment-head">
                <span className="comment-author">{c.nickname}</span>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="comment-text">{c.text}</div>
              {user?.id === c.userId && (
                <button
                  className="comment-delete"
                  onClick={() => handleDeleteComment(c.id)}
                >
                  Удалить
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </div>
  );
}
