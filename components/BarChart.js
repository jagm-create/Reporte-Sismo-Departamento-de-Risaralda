'use client';

export default function BarChart({ rows, metricKey, metricLabel, critical }) {
  const sorted = [...rows]
    .map((r) => ({ name: r.name, value: Number(r[metricKey]) || 0 }))
    .sort((a, b) => b.value - a.value);

  const max = Math.max(1, ...sorted.map((r) => r.value));

  return (
    <div className="bar-chart">
      {sorted.map((r) => (
        <div className="bar-row" key={r.name}>
          <div className="bar-label">{r.name}</div>
          <div className="bar-track">
            <div
              className={`bar-fill ${critical ? 'critical' : ''}`}
              style={{ width: `${(r.value / max) * 100}%` }}
            />
          </div>
          <div className="bar-value">{r.value.toLocaleString('es-CO')}</div>
        </div>
      ))}
    </div>
  );
}
