import Link from 'next/link';

export const metadata = {
  title: 'Reporte sismo Risaralda',
};

export default function HomePage() {
  return (
    <div className="landing">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="Logo CDGRD Risaralda" className="landing-logo" />
      <h1>Reporte sismo 10 de agosto</h1>
      <p>Coordinación Departamental de Gestión del Riesgo de Desastres — Risaralda</p>
      <div className="landing-links">
        <Link href="/editar" className="btn">
          ✏️ Ir al panel editable
        </Link>
        <Link href="/ver" className="btn ghost">
          🔒 Ir a la vista de solo lectura
        </Link>
      </div>
      <p className="landing-hint">
        Los cambios que hagas en el panel editable se reflejan automáticamente en la vista de
        solo lectura en unos segundos — ambos leen el mismo dato guardado en la base KV de
        Vercel.
      </p>
    </div>
  );
}
