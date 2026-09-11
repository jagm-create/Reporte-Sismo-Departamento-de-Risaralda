'use client';

import { useEffect, useRef, useState } from 'react';
import { COLUMNS, COLUMN_GROUPS, VIVIENDA_SUM_KEYS } from '../lib/columns';
import BarChart from './BarChart';

const POLL_MS = 6000; // en modo "ver", refresca cada 6s para reflejar cambios de /editar
const SAVE_DEBOUNCE_MS = 700;

function computeTotals(rows) {
  const totals = {};
  COLUMNS.forEach((c) => {
    if (c.type === 'num') {
      totals[c.key] = rows.reduce((s, r) => s + (Number(r[c.key]) || 0), 0);
    }
  });
  return totals;
}

function blankRow() {
  const row = {};
  COLUMNS.forEach((c) => {
    row[c.key] = c.type === 'text' ? 'Nuevo municipio' : 0;
  });
  return row;
}

export default function Dashboard({ editable }) {
  const [rows, setRows] = useState([]);
  const [meta, setMeta] = useState({ titulo: '', fecha: '', hora: '' });
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [metric, setMetric] = useState('familias');
  const kpiCols = COLUMNS.filter((c) => c.kpi);
  const saveTimeout = useRef(null);
  const skipNextPoll = useRef(false);

  async function loadData() {
    try {
      const res = await fetch('/api/data', { cache: 'no-store' });
      const data = await res.json();
      if (skipNextPoll.current) {
        // Acabamos de guardar nosotros mismos; no pisemos lo que el usuario está escribiendo.
        skipNextPoll.current = false;
        return;
      }
      setRows(data.rows || []);
      setMeta(data.meta || {});
    } catch (e) {
      console.error('Error cargando datos', e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    if (!editable) {
      const interval = setInterval(loadData, POLL_MS);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function scheduleSave(nextRows, nextMeta) {
    setSaveStatus('Guardando…');
    clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(async () => {
      try {
        skipNextPoll.current = true;
        const res = await fetch('/api/data', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rows: nextRows, meta: nextMeta }),
        });
        if (!res.ok) {
          const err = await res.json();
          setSaveStatus(err.error || 'No se pudo guardar.');
          return;
        }
        setSaveStatus('Cambios guardados ✓ — visibles en /ver');
      } catch (e) {
        setSaveStatus('No se pudo guardar: ' + e.message);
      }
    }, SAVE_DEBOUNCE_MS);
  }

  function updateCell(idx, key, value) {
    const next = rows.map((r, i) => (i === idx ? { ...r, [key]: value } : r));
    setRows(next);
    scheduleSave(next, meta);
  }

  function updateMeta(key, value) {
    const next = { ...meta, [key]: value };
    setMeta(next);
    scheduleSave(rows, next);
  }

  function addRow() {
    const next = [...rows, blankRow()];
    setRows(next);
    scheduleSave(next, meta);
  }

  function deleteRow(idx) {
    if (!confirm(`¿Eliminar "${rows[idx].name}" del reporte?`)) return;
    const next = rows.filter((_, i) => i !== idx);
    setRows(next);
    scheduleSave(next, meta);
  }

  if (loading) {
    return <div className="loading">Cargando datos…</div>;
  }

  const totals = computeTotals(rows);
  const vivTotal = VIVIENDA_SUM_KEYS.reduce((s, k) => s + (totals[k] || 0), 0);
  const vivBreakdown = VIVIENDA_SUM_KEYS.map((k) => {
    const col = COLUMNS.find((c) => c.key === k);
    return `${col.label} ${(totals[k] || 0).toLocaleString('es-CO')}`;
  }).join(' + ');

  return (
    <div className="dashboard">
      <header className="top">
        <div className="top-row">
          <div className="logo-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Logo CDGRD Risaralda" />
          </div>
          <div className="title-block">
            {editable ? (
              <input
                className="title-input"
                value={meta.titulo || ''}
                onChange={(e) => updateMeta('titulo', e.target.value)}
              />
            ) : (
              <h1>{meta.titulo}</h1>
            )}
            <div className="subtitle">
              Coordinación Departamental de Gestión del Riesgo de Desastres — Risaralda
            </div>
          </div>
          <div className={`badge ${editable ? 'badge-edit' : 'badge-view'}`}>
            {editable ? '✏️ Modo edición' : '🔒 Solo lectura'}
          </div>
        </div>
        <div className="meta-row">
          <div className="meta-item">
            <span className="label">FECHA DEL CORTE</span>
            {editable ? (
              <input value={meta.fecha || ''} onChange={(e) => updateMeta('fecha', e.target.value)} />
            ) : (
              <div className="meta-static">{meta.fecha}</div>
            )}
          </div>
          <div className="meta-item">
            <span className="label">HORA DEL CORTE</span>
            {editable ? (
              <input value={meta.hora || ''} onChange={(e) => updateMeta('hora', e.target.value)} />
            ) : (
              <div className="meta-static">{meta.hora}</div>
            )}
          </div>
          <div className="meta-item">
            <span className="label">MUNICIPIOS REPORTANDO</span>
            <div className="meta-static">{rows.length}</div>
          </div>
        </div>
      </header>

      <main>
        <div className="section-title">
          Resumen departamental
          <div className="rule" />
        </div>
        <div className="kpi-grid">
          {kpiCols.map((c) => (
            <div className={`kpi ${c.critical ? 'critical' : ''}`} key={c.key}>
              <div className="num">{(totals[c.key] || 0).toLocaleString('es-CO')}</div>
              <div className="lbl">{c.kpiLabel || c.label}</div>
            </div>
          ))}
          <div className="kpi">
            <div className="num">{rows.length}</div>
            <div className="lbl">Municipios reportando</div>
          </div>
          <div className="kpi kpi-wide">
            <div className="num">{vivTotal.toLocaleString('es-CO')}</div>
            <div className="lbl">Total vivienda</div>
            <div className="kpi-formula">
              Suma de: {vivBreakdown}. <em>&quot;V. Averiadas&quot; es un dato combinado del reporte.</em>
            </div>
          </div>
        </div>

        <div className="section-title">
          Comparativo por municipio
          <div className="rule" />
        </div>
        <div className="panel">
          <div className="chart-controls">
            <label htmlFor="metric">Variable a visualizar</label>
            <select id="metric" value={metric} onChange={(e) => setMetric(e.target.value)}>
              {COLUMNS.filter((c) => c.type !== 'text').map((c) => (
                <option key={c.key} value={c.key}>
                  {c.kpiLabel || c.label}
                </option>
              ))}
            </select>
          </div>
          <BarChart
            rows={rows}
            metricKey={metric}
            metricLabel={metric}
            critical={COLUMNS.find((c) => c.key === metric)?.critical}
          />
        </div>

        <div className="section-title">
          Datos por municipio {editable ? '(editable)' : ''}
          <div className="rule" />
        </div>
        <div className="table-toolbar">
          <div className="hint">
            {editable
              ? 'Haz clic sobre cualquier celda para editarla. Se guarda solo y se refleja en /ver.'
              : 'Vista de solo lectura — estos datos no se pueden modificar desde aquí.'}
          </div>
          {editable && (
            <div className="toolbar-btns">
              <button className="btn ghost" onClick={addRow}>
                + Añadir municipio
              </button>
            </div>
          )}
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr className="group-row">
                <th />
                {COLUMN_GROUPS.map((g) => (
                  <th key={g.label} colSpan={g.span}>
                    {g.label}
                  </th>
                ))}
                {editable && <th />}
              </tr>
              <tr>
                <th>Municipio</th>
                {COLUMNS.slice(1).map((c) => (
                  <th key={c.key} title={c.tooltip}>
                    {c.label}
                    {c.tooltip ? ' ⓘ' : ''}
                  </th>
                ))}
                {editable && <th />}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr key={idx}>
                  {COLUMNS.map((c) => (
                    <td key={c.key}>
                      {editable ? (
                        <input
                          type={c.type === 'text' ? 'text' : 'number'}
                          value={row[c.key] ?? (c.type === 'text' ? '' : 0)}
                          onChange={(e) =>
                            updateCell(
                              idx,
                              c.key,
                              c.type === 'text' ? e.target.value : Number(e.target.value) || 0
                            )
                          }
                        />
                      ) : c.type === 'text' ? (
                        row[c.key]
                      ) : (
                        (Number(row[c.key]) || 0).toLocaleString('es-CO')
                      )}
                    </td>
                  ))}
                  {editable && (
                    <td className="del-cell">
                      <button className="btn danger" onClick={() => deleteRow(idx)} title="Eliminar municipio">
                        ×
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td>Total departamental</td>
                {COLUMNS.slice(1).map((c) => (
                  <td key={c.key}>{c.type === 'num' ? (totals[c.key] || 0).toLocaleString('es-CO') : ''}</td>
                ))}
                {editable && <td />}
              </tr>
            </tfoot>
          </table>
        </div>

        {editable && <div className="save-status">{saveStatus}</div>}
      </main>

      <footer>
        {meta.titulo} · Sistema Departamental de Gestión del Riesgo de Desastres
        {editable ? ' · Los cambios se ven en /ver en unos segundos' : ' · Vista de solo lectura'}
      </footer>
    </div>
  );
}
