import './UploadsStatsChart.css';

export interface StatItem {
  id: string;
  title: string;
  likeCount?: number;
  viewCount?: number;
  downloadCount?: number;
}

interface Metric {
  key: 'likeCount' | 'viewCount' | 'downloadCount';
  label: string;
  color: string;
  icon: string;
}

const METRICS: Metric[] = [
  { key: 'likeCount', label: 'Лайки', color: '#ff5a7a', icon: '♥' },
  { key: 'viewCount', label: 'Просмотры', color: '#646cff', icon: '👁' },
  { key: 'downloadCount', label: 'Скачивания', color: '#22d3ee', icon: '⬇' },
];

function Chart({ items, metric }: { items: StatItem[]; metric: Metric }) {
  const values = items.map((m) => m[metric.key] ?? 0);
  const max = Math.max(1, ...values);
  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="stats-chart">
      <div className="stats-chart-head">
        <span className="stats-chart-title">
          <span className="stats-chart-icon" style={{ color: metric.color }}>
            {metric.icon}
          </span>
          {metric.label}
        </span>
        <span className="stats-chart-total">Всего: {total}</span>
      </div>
      <div className="stats-chart-bars">
        {items.map((m, i) => {
          const v = values[i];
          const pct = (v / max) * 100;
          return (
            <div key={m.id} className="stats-bar-row" title={`${m.title}: ${v}`}>
              <div className="stats-bar-label">{m.title || '—'}</div>
              <div className="stats-bar-track">
                <div
                  className="stats-bar-fill"
                  style={{ width: `${pct}%`, backgroundColor: metric.color }}
                />
                <span className="stats-bar-value">{v}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface Props {
  items: StatItem[];
  title?: string;
}

export default function UploadsStatsChart({ items, title = 'Статистика ваших моделей' }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="uploads-stats">
      <h2 className="uploads-stats-title">{title}</h2>
      <div className="uploads-stats-grid">
        {METRICS.map((m) => (
          <Chart key={m.key} items={items} metric={m} />
        ))}
      </div>
    </div>
  );
}
