# Reporte sismo Risaralda — Dashboard en Vercel

App con dos vistas del mismo dato:
- `/editar` — panel editable (para el equipo del CDGRD).
- `/ver` — vista de solo lectura (para compartir con quien solo debe consultar).

Ambas leen y escriben el **mismo dato compartido**, guardado en una base KV de
Vercel. Cuando editas en `/editar`, `/ver` se actualiza sola en unos 6 segundos
(sin recargar nada a mano).

## 1. Requisitos

- Una cuenta gratuita en [vercel.com](https://vercel.com) (puedes entrar con
  GitHub, GitLab o email).
- Una cuenta en [github.com](https://github.com) (gratis) para subir este
  código — Vercel despliega directamente desde un repositorio de GitHub.

## 2. Subir el código a GitHub

1. Crea un repositorio nuevo y vacío en GitHub (por ejemplo
   `reporte-sismo-risaralda`).
2. Descomprime esta carpeta en tu computador y, dentro de ella, ejecuta:
   ```bash
   git init
   git add .
   git commit -m "Dashboard reporte sismo Risaralda"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/reporte-sismo-risaralda.git
   git push -u origin main
   ```
   (Reemplaza `TU-USUARIO` por tu usuario de GitHub. Si nunca has usado git,
   GitHub Desktop es una alternativa con interfaz gráfica.)

## 3. Desplegar en Vercel

1. Entra a [vercel.com/new](https://vercel.com/new) e inicia sesión.
2. Elige "Import Git Repository" y selecciona el repositorio que acabas de
   crear.
3. Deja la configuración por defecto (Vercel detecta que es un proyecto
   Next.js automáticamente) y da clic en **Deploy**.
4. En 1-2 minutos tendrás una URL como
   `https://reporte-sismo-risaralda.vercel.app`.

En este punto la app ya funciona, pero **los datos no se guardan todavía**
porque falta conectar la base de datos (paso 4). Sin ese paso, cada quien
verá los datos originales y los cambios no se compartirán entre pestañas.

## 4. Conectar la base de datos (Vercel KV)

1. Dentro de tu proyecto en Vercel, ve a la pestaña **Storage**.
2. Da clic en **Create Database** (o **Browse Marketplace**) → elige una
   base **Redis** (el proveedor recomendado es Upstash — el plan gratuito
   alcanza de sobra para este uso).
3. Ponle un nombre (por ejemplo `reporte-sismo-db`) y créala.
4. Vercel te preguntará a qué proyecto conectarla: elige el que acabas de
   desplegar. Esto agrega automáticamente las variables de entorno que la
   app necesita (`KV_REST_API_URL` / `KV_REST_API_TOKEN`, o
   `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` según la
   integración) — no hay que copiarlas a mano.
5. Ve a la pestaña **Deployments**, abre el último despliegue y da clic en
   **Redeploy** para que tome las nuevas variables de entorno.

Después de esto, `/editar` y `/ver` ya comparten el mismo dato en vivo.

## 5. Compartir los enlaces

- Panel editable (equipo CDGRD): `https://TU-DOMINIO.vercel.app/editar`
- Vista de solo lectura (para difundir): `https://TU-DOMINIO.vercel.app/ver`

Puedes configurar un dominio propio (por ejemplo `reporte.cdgrd.gov.co`)
desde la pestaña **Settings → Domains** del proyecto en Vercel.

## 6. Actualizar el reporte con un nuevo corte de datos

Cuando llegue un nuevo Excel con un corte distinto, puedes:
- **Opción rápida:** editar directamente los valores en `/editar` (celda por
  celda, como en la versión anterior en HTML).
- **Opción con Claude:** pídele a Claude que lea el nuevo Excel y actualice
  `lib/defaultData.js` con los valores nuevos — eso solo cambia el punto de
  partida cuando la base KV está vacía, así que lo más práctico para cortes
  nuevos es la opción rápida de arriba.

## Desarrollo local (opcional)

```bash
npm install
npm run dev
```

Abre `http://localhost:3000`. En local, si no configuras variables de KV,
la app funciona en modo "solo lectura de los datos por defecto": puedes ver
el diseño, pero el guardado mostrará un aviso porque no hay base de datos
conectada. Para probar el guardado en local, copia las variables de entorno
desde Vercel (Settings → Environment Variables) a un archivo `.env.local`.
