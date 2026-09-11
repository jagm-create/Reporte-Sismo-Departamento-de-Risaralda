// Configuración de columnas del reporte.
// type: 'text' | 'num'
// kpi: true -> aparece como tarjeta resumen en la parte superior
// critical: true -> la tarjeta/tabla la resalta en rojo (fallecidos, desaparecidos)
export const COLUMNS = [
  { key: 'name', label: 'Municipio', type: 'text' },
  { key: 'fallecidos', label: 'Fallecidos', type: 'num', kpi: true, critical: true },
  { key: 'heridos', label: 'Heridos', type: 'num', kpi: true },
  { key: 'desaparecidos', label: 'Desap.', type: 'num', kpi: true, critical: true },
  { key: 'rescatados', label: 'Rescatados', type: 'num', kpi: true },
  { key: 'vivDestruidas', label: 'V. Destruidas', type: 'num', kpi: true, kpiLabel: 'Viviendas destruidas' },
  { key: 'vivAveriadas', label: 'V. Averiadas', type: 'num', tooltip: 'Dato combinado del reporte: incluye viviendas habitables, no habitables y averiadas en un solo total.' },
  { key: 'edifColapsados', label: 'Edif. Colapsados', type: 'num' },
  { key: 'edifAveriadas', label: 'Edif. Averiados', type: 'num' },
  { key: 'centrosEducativos', label: 'C. Educativos', type: 'num' },
  { key: 'centrosSalud', label: 'C. Salud', type: 'num' },
  { key: 'viasPuentes', label: 'Vías/Puentes', type: 'num' },
  { key: 'centrosComunitarios', label: 'C. Comunitarios', type: 'num' },
  { key: 'acueductos', label: 'Acueductos', type: 'num' },
  { key: 'familias', label: 'Familias', type: 'num', kpi: true },
  { key: 'personas', label: 'Personas', type: 'num', kpi: true },
  { key: 'aeropuertos', label: 'Aeropuertos', type: 'num' },
  { key: 'animales', label: 'Animales atendidos', type: 'num' },
];

// Columnas que se suman para la tarjeta compuesta "Total vivienda"
export const VIVIENDA_SUM_KEYS = ['vivDestruidas', 'vivAveriadas'];

// Agrupación de encabezados para la tabla
export const COLUMN_GROUPS = [
  { label: 'Personas', span: 4 },
  { label: 'Vivienda', span: 2 },
  { label: 'Edificios', span: 2 },
  { label: 'Infraestructura y afectación', span: 9 },
];
