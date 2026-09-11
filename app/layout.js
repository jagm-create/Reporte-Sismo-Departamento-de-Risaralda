import './globals.css';

export const metadata = {
  title: 'Reporte sismo Risaralda',
  description: 'CDGRD Risaralda — Sistema Departamental de Gestión del Riesgo de Desastres',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
