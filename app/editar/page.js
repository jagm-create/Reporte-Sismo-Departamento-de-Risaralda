import Dashboard from '../../components/Dashboard';

export const metadata = {
  title: 'Editar — Reporte sismo Risaralda',
};

export default function EditarPage() {
  return <Dashboard editable={true} />;
}
