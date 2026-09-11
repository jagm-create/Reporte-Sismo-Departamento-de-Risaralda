import { NextResponse } from 'next/server';
import { DEFAULT_DATA, DEFAULT_META } from '../../../lib/defaultData';

const KEY = 'reporte-sismo-risaralda:v1';

// Evita que Next cachee esta ruta - siempre queremos el dato más reciente.
export const dynamic = 'force-dynamic';

function getKv() {
  // Si las variables de entorno de la base Redis (Vercel Marketplace / Upstash)
  // no existen todavía (por ejemplo en desarrollo local sin conectar una base),
  // devolvemos null y la API responde con los datos por defecto.
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  const { Redis } = require('@upstash/redis');
  return new Redis({ url, token });
}

export async function GET() {
  const kv = getKv();
  if (kv) {
    try {
      const data = await kv.get(KEY);
      if (data) return NextResponse.json(data);
    } catch (e) {
      // Sigue abajo y devuelve el valor por defecto
    }
  }
  return NextResponse.json({
    rows: DEFAULT_DATA,
    meta: DEFAULT_META,
    updatedAt: null,
  });
}

export async function PUT(request) {
  const body = await request.json();
  const payload = {
    rows: body.rows,
    meta: body.meta,
    updatedAt: new Date().toISOString(),
  };

  const kv = getKv();
  if (!kv) {
    return NextResponse.json(
      {
        error:
          'No hay una base de datos KV conectada todavía. Ve a tu proyecto en Vercel > Storage y conecta una base KV (Upstash Redis) para que los cambios se guarden y se vean en /ver.',
      },
      { status: 500 }
    );
  }

  try {
    await kv.set(KEY, payload);
  } catch (e) {
    return NextResponse.json({ error: 'No se pudo guardar en la base KV: ' + e.message }, { status: 500 });
  }

  return NextResponse.json(payload);
}
