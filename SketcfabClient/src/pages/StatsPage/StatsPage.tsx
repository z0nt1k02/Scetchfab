import './StatsPage.css';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getModel } from '../../api/modelsApi';
import { getImage } from '../../api/imageAssetsApi';
import {
  getLikeState,
  getComments,
} from '../../api/interactionsApi';
import {
  getImageLikeState,
  getImageComments,
} from '../../api/imageInteractionsApi';
import { useAuth } from '../../features/auth/AuthContext';
import type { Comment, ImageAsset, Model } from '../../types';

type Kind = 'model' | 'image';

interface StatsData {
  id: string;
  title: string;
  previewUrl: string | null;
  creatorName: string;
  category: string | null | undefined;
  tags: string[];
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string | null;
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function engagementRate(likes: number, comments: number, views: number): number {
  if (views <= 0) return 0;
  return ((likes + comments) / views) * 100;
}

function downloadRate(downloads: number, views: number): number {
  if (views <= 0) return 0;
  return (downloads / views) * 100;
}

interface MetricCardProps {
  label: string;
  value: number;
  icon: string;
  tone: 'blue' | 'pink' | 'green' | 'amber';
  hint?: string;
}

function MetricCard({ label, value, icon, tone, hint }: MetricCardProps) {
  return (
    <div className={`stats-metric stats-metric--${tone}`}>
      <div className="stats-metric-icon">{icon}</div>
      <div className="stats-metric-body">
        <div className="stats-metric-label">{label}</div>
        <div className="stats-metric-value">{value.toLocaleString('ru-RU')}</div>
        {hint && <div className="stats-metric-hint">{hint}</div>}
      </div>
    </div>
  );
}

interface RingProps {
  value: number;
  max?: number;
  label: string;
  sub?: string;
  color: string;
}

function ProgressRing({ value, max = 100, label, sub, color }: RingProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const bg = `conic-gradient(${color} ${pct}%, var(--surface-3) 0%)`;
  return (
    <div className="stats-ring">
      <div className="stats-ring-disc" style={{ background: bg }}>
        <div className="stats-ring-inner">
          <div className="stats-ring-value" style={{ color }}>
            {pct.toFixed(1)}%
          </div>
          <div className="stats-ring-label">{label}</div>
        </div>
      </div>
      {sub && <div className="stats-ring-sub">{sub}</div>}
    </div>
  );
}

export default function StatsPage() {
  const { kind, id } = useParams<{ kind: Kind; id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [data, setData] = useState<StatsData | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!kind || !id) return;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        if (kind === 'model') {
          const [m, likeState, cs] = await Promise.all([
            getModel(id),
            getLikeState(id, user?.id ?? null),
            getComments(id),
          ]);
          const model = m as Model;
          setData({
            id: model.id,
            title: model.title,
            previewUrl: model.previewUrl ?? null,
            creatorName: '—',
            category: model.category,
            tags: model.tags ?? [],
            viewCount: model.viewCount ?? 0,
            downloadCount: model.downloadCount ?? 0,
            likeCount: likeState.count,
            commentCount: cs.length,
            createdAt: null,
          });
          setComments(cs);
        } else if (kind === 'image') {
          const [img, likeState, cs] = await Promise.all([
            getImage(id),
            getImageLikeState(id, user?.id ?? null),
            getImageComments(id),
          ]);
          const image = img as ImageAsset;
          setData({
            id: image.id,
            title: image.title,
            previewUrl: image.fileUrl,
            creatorName: image.creatorName,
            category: image.category,
            tags: image.tags,
            viewCount: image.viewCount,
            downloadCount: image.downloadCount,
            likeCount: likeState.count,
            commentCount: cs.length,
            createdAt: image.createdAt,
          });
          setComments(cs);
        } else {
          setError('Неизвестный тип ресурса');
        }
      } catch (err) {
        console.error('stats load failed', err);
        setError('Не удалось загрузить статистику');
      } finally {
        setLoading(false);
      }
    })();
  }, [kind, id, user?.id]);

  const commentsByDay = useMemo(() => {
    if (comments.length === 0) return [] as { day: string; count: number }[];
    const buckets = new Map<string, number>();
    comments.forEach((c) => {
      const d = new Date(c.createdAt);
      const key = d.toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    });
    const sorted = Array.from(buckets.entries())
      .sort(([a], [b]) => (a < b ? -1 : 1))
      .slice(-14);
    return sorted.map(([day, count]) => ({ day, count }));
  }, [comments]);

  const topCommenters = useMemo(() => {
    const map = new Map<string, number>();
    comments.forEach((c) => {
      map.set(c.nickname, (map.get(c.nickname) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
  }, [comments]);

  if (loading) {
    return (
      <main className="stats-page">
        <div className="stats-status">Загрузка статистики...</div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="stats-page">
        <div className="stats-status">{error ?? 'Ресурс не найден'}</div>
        <button className="stats-back" onClick={() => navigate('/profile')}>
          ← Назад в профиль
        </button>
      </main>
    );
  }

  const engagement = engagementRate(data.likeCount, data.commentCount, data.viewCount);
  const download = downloadRate(data.downloadCount, data.viewCount);
  const maxBar = Math.max(1, ...commentsByDay.map((b) => b.count));
  const viewHref = kind === 'model' ? `/model/${data.id}` : `/image/${data.id}`;

  return (
    <main className="stats-page">
      <div className="stats-topbar">
        <button className="stats-back" onClick={() => navigate('/profile')}>
          ← В профиль
        </button>
        <Link to={viewHref} className="stats-view-link">
          Открыть {kind === 'model' ? 'модель' : 'изображение'} →
        </Link>
      </div>

      <section className="stats-hero">
        <div className="stats-hero-preview">
          {data.previewUrl ? (
            <img src={data.previewUrl} alt={data.title} />
          ) : (
            <div className="stats-hero-placeholder">
              {kind === 'model' ? '3D' : 'IMG'}
            </div>
          )}
        </div>
        <div className="stats-hero-info">
          <span className="stats-kind-badge">
            {kind === 'model' ? '3D модель' : '2D изображение'}
          </span>
          <h1 className="stats-hero-title">{data.title}</h1>
          <div className="stats-hero-meta">
            <span>
              <strong>Автор:</strong> {data.creatorName}
            </span>
            {data.createdAt && (
              <span>
                <strong>Опубликовано:</strong> {formatDate(data.createdAt)}
              </span>
            )}
          </div>
          {(data.category || data.tags.length > 0) && (
            <div className="stats-hero-chips">
              {data.category && (
                <span className="chip chip-category">{data.category}</span>
              )}
              {data.tags.map((t) => (
                <span key={t} className="chip chip-tag">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="stats-grid">
        <MetricCard
          label="Просмотры"
          value={data.viewCount}
          icon="👁"
          tone="blue"
          hint="Всего открытий страницы"
        />
        <MetricCard
          label="Лайки"
          value={data.likeCount}
          icon="♥"
          tone="pink"
          hint="Отметки «Нравится»"
        />
        <MetricCard
          label="Скачивания"
          value={data.downloadCount}
          icon="⬇"
          tone="green"
          hint="Загрузок файла"
        />
        <MetricCard
          label="Комментарии"
          value={data.commentCount}
          icon="💬"
          tone="amber"
          hint="Обсуждений от пользователей"
        />
      </section>

      <section className="stats-ratios">
        <div className="stats-ratio-card">
          <h3>Уровень вовлечённости</h3>
          <p className="stats-ratio-desc">
            (лайки + комментарии) / просмотры × 100%
          </p>
          <ProgressRing
            value={engagement}
            label="Engagement"
            color="#5b6cff"
            sub={`${data.likeCount + data.commentCount} реакций на ${data.viewCount} просмотров`}
          />
        </div>
        <div className="stats-ratio-card">
          <h3>Конверсия в скачивание</h3>
          <p className="stats-ratio-desc">
            скачивания / просмотры × 100%
          </p>
          <ProgressRing
            value={download}
            label="Downloads"
            color="#16a34a"
            sub={`${data.downloadCount} скачиваний из ${data.viewCount} просмотров`}
          />
        </div>
        <div className="stats-ratio-card">
          <h3>Распределение активности</h3>
          <p className="stats-ratio-desc">
            Доля каждого типа реакций
          </p>
          <div className="stats-distribution">
            {(() => {
              const total = data.likeCount + data.commentCount + data.downloadCount;
              if (total === 0) {
                return <div className="stats-distribution-empty">Пока нет активности</div>;
              }
              const rows: Array<[string, number, string]> = [
                ['♥ Лайки', data.likeCount, '#ec4899'],
                ['💬 Комментарии', data.commentCount, '#f59e0b'],
                ['⬇ Скачивания', data.downloadCount, '#16a34a'],
              ];
              return rows.map(([label, val, color]) => (
                <div key={label} className="stats-distribution-row">
                  <span className="stats-distribution-label">{label}</span>
                  <div className="stats-distribution-bar">
                    <div
                      className="stats-distribution-fill"
                      style={{ width: `${(val / total) * 100}%`, backgroundColor: color }}
                    />
                  </div>
                  <span className="stats-distribution-value">
                    {((val / total) * 100).toFixed(0)}%
                  </span>
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className="stats-card">
        <h2 className="stats-card-title">Активность комментариев</h2>
        {commentsByDay.length === 0 ? (
          <div className="stats-empty">
            Пока никто не комментировал — попробуйте поделиться работой в соцсетях.
          </div>
        ) : (
          <div className="stats-timeline">
            {commentsByDay.map((b) => {
              const h = (b.count / maxBar) * 100;
              return (
                <div key={b.day} className="stats-timeline-col" title={`${b.day}: ${b.count}`}>
                  <div className="stats-timeline-bar" style={{ height: `${h}%` }}>
                    <span className="stats-timeline-num">{b.count}</span>
                  </div>
                  <div className="stats-timeline-day">{b.day.slice(5)}</div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="stats-two-col">
        <div className="stats-card">
          <h2 className="stats-card-title">Топ обсуждающих</h2>
          {topCommenters.length === 0 ? (
            <div className="stats-empty">Пока нет комментариев</div>
          ) : (
            <ul className="stats-top-list">
              {topCommenters.map(([name, count], idx) => (
                <li key={name} className="stats-top-item">
                  <span className="stats-top-rank">#{idx + 1}</span>
                  <span className="stats-top-name">{name}</span>
                  <span className="stats-top-count">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="stats-card">
          <h2 className="stats-card-title">Последние комментарии</h2>
          {comments.length === 0 ? (
            <div className="stats-empty">Пока нет комментариев</div>
          ) : (
            <ul className="stats-recent-list">
              {comments.slice(0, 5).map((c) => (
                <li key={c.id} className="stats-recent-item">
                  <div className="stats-recent-head">
                    <span className="stats-recent-author">{c.nickname}</span>
                    <span className="stats-recent-date">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="stats-recent-text">{c.text}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
