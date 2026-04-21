import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/AuthContext';
import { getModels } from '../../api/modelsApi';
import { getImages } from '../../api/imageAssetsApi';
import {
  getUserUploads,
  getUserLikedModelIds,
} from '../../api/interactionsApi';
import { getUserLikedImageIds } from '../../api/imageInteractionsApi';
import ModelCard from '../../features/models/ModelCard';
import ImageCard from '../../features/images/ImageCard';
import UploadsStatsChart from '../../features/models/UploadsStatsChart';
import type { Model, ImageAsset } from '../../types';
import './ProfilePage.css';

type Tab = 'uploads' | 'liked';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState<Tab>('uploads');
  const [models, setModels] = useState<Model[]>([]);
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [likedModelIdsArr, setLikedModelIdsArr] = useState<string[]>([]);
  const [likedImageIdsArr, setLikedImageIdsArr] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    Promise.all([
      getModels(1, 100),
      getImages(1, 100),
      getUserLikedModelIds(user.id),
      getUserLikedImageIds(user.id),
    ])
      .then(([mList, iList, likedM, likedI]) => {
        setModels(mList);
        setImages(iList);
        setLikedModelIdsArr(likedM);
        setLikedImageIdsArr(likedI);
      })
      .catch((e) => console.error('profile load failed', e))
      .finally(() => setLoading(false));
  }, [user]);

  const uploadedIds = useMemo(
    () => (user ? new Set(getUserUploads(user.id)) : new Set<string>()),
    [user, models, images]
  );
  const likedModelIds = useMemo(() => new Set(likedModelIdsArr), [likedModelIdsArr]);
  const likedImageIds = useMemo(() => new Set(likedImageIdsArr), [likedImageIdsArr]);

  const uploadedModels = useMemo(
    () => models.filter((m) => uploadedIds.has(m.id)),
    [models, uploadedIds]
  );
  const uploadedImages = useMemo(
    () => images.filter((i) => uploadedIds.has(i.id)),
    [images, uploadedIds]
  );
  const likedModels = useMemo(
    () => models.filter((m) => likedModelIds.has(m.id)),
    [models, likedModelIds]
  );
  const likedImages = useMemo(
    () => images.filter((i) => likedImageIds.has(i.id)),
    [images, likedImageIds]
  );

  if (!user) {
    return (
      <main className="profile-page">
        <div className="profile-empty">
          <h2>Вы не авторизованы</h2>
          <p>Войдите в аккаунт, чтобы открыть личный кабинет.</p>
          <button onClick={() => navigate('/')}>На главную</button>
        </div>
      </main>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const activeModels = tab === 'uploads' ? uploadedModels : likedModels;
  const activeImages = tab === 'uploads' ? uploadedImages : likedImages;
  const totalActive = activeModels.length + activeImages.length;
  const uploadsTotal = uploadedModels.length + uploadedImages.length;
  const likedTotal = likedModels.length + likedImages.length;
  const emptyMessage =
    tab === 'uploads'
      ? 'Вы ещё не загрузили ни одного ресурса'
      : 'Вы ещё не лайкнули ни одного ресурса';

  return (
    <main className="profile-page">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.nickname.charAt(0).toUpperCase()}
          </div>
          <div className="profile-identity">
            <h1>{user.nickname}</h1>
            {user.role && <span className="profile-role">{user.role}</span>}
          </div>
        </div>

        <div className="profile-info">
          <div className="profile-field">
            <span className="profile-field-label">Никнейм</span>
            <span className="profile-field-value">{user.nickname}</span>
          </div>
          {user.role && (
            <div className="profile-field">
              <span className="profile-field-label">Роль</span>
              <span className="profile-field-value">{user.role}</span>
            </div>
          )}
        </div>

        <div className="profile-actions">
          <button className="profile-upload" onClick={() => navigate('/upload')}>
            Загрузить ресурс
          </button>
          <button className="profile-logout" onClick={handleLogout}>
            Выйти из аккаунта
          </button>
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`profile-tab${tab === 'uploads' ? ' active' : ''}`}
          onClick={() => setTab('uploads')}
        >
          Выложенные ({uploadsTotal})
        </button>
        <button
          className={`profile-tab${tab === 'liked' ? ' active' : ''}`}
          onClick={() => setTab('liked')}
        >
          Понравившиеся ({likedTotal})
        </button>
      </div>

      {loading ? (
        <div className="profile-status">Загрузка...</div>
      ) : totalActive === 0 ? (
        <div className="profile-status">{emptyMessage}</div>
      ) : (
        <>
          {activeModels.length > 0 && (
            <>
              <h3 className="profile-section-title">
                Модели ({activeModels.length})
              </h3>
              <div className="profile-models-grid">
                {activeModels.map((m) => (
                  <ModelCard key={m.id} model={m} />
                ))}
              </div>
            </>
          )}
          {activeImages.length > 0 && (
            <>
              <h3 className="profile-section-title">
                Изображения ({activeImages.length})
              </h3>
              <div className="profile-models-grid">
                {activeImages.map((i) => (
                  <ImageCard key={i.id} image={i} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {tab === 'uploads' && !loading && uploadedModels.length > 0 && (
        <UploadsStatsChart
          items={uploadedModels}
          title="Статистика ваших моделей"
        />
      )}
      {tab === 'uploads' && !loading && uploadedImages.length > 0 && (
        <UploadsStatsChart
          items={uploadedImages}
          title="Статистика ваших изображений"
        />
      )}
    </main>
  );
}
