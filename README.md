# Delfos Frontend

Frontend de Delfos construido con Next.js 15, React y Chakra UI. Se conecta al backend mediante `NEXT_PUBLIC_API_URL`.

## Requisitos
- Node.js LTS
- Variables de entorno en `.env` (ver `NEXT_PUBLIC_API_URL` y `DELFOS_BACKEND_URL`).

## Scripts
- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`

## Estructura
- `app/` páginas y layouts
- `src/` componentes y utilidades compartidas
- `public/` assets estáticos

## Desarrollo local
Ajusta `NEXT_PUBLIC_API_URL` en `.env` al backend que tengas disponible (p. ej. `http://localhost:8000`). Reinicia el servidor de desarrollo tras cambiarla.

## Licencia
MIT © Business Integration Partners
