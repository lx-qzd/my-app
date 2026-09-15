## Requisitos

- Node.js instalado.
- Dependencias instaladas con `npm install`.

## Desarrollo

Esta aplicación usa Next.js para el frontend y JSON Server como API local. El frontend espera encontrar la API en `http://localhost:3001`.

### Opción recomendada: iniciar todo junto

Desde la raíz del proyecto, ejecuta:

```bash
npm install
npm run dev:all
```

Este comando inicia ambos procesos:

- Frontend Next.js: [http://localhost:3000](http://localhost:3000)
- JSON Server: [http://localhost:3001](http://localhost:3001)

Abre [http://localhost:3000](http://localhost:3000) en el navegador. Los datos de clientes y direcciones se guardan en `db.json`.

### Iniciar cada servicio por separado

Si prefieres usar terminales independientes, abre dos terminales en la raíz del proyecto.

En la primera, inicia el frontend:

```bash
npm run dev
```

En la segunda, inicia JSON Server:

```bash
npm run dev:json
```

Luego visita [http://localhost:3000](http://localhost:3000). Ambos servicios deben estar activos para que el directorio de clientes funcione correctamente.

Para detener los servicios, presiona `Ctrl+C` en la terminal o terminales donde estén ejecutándose.

## Otros comandos

```bash
npm run lint   # Ejecuta ESLint
npm run build  # Genera la compilación de producción
npm start      # Inicia la aplicación compilada
```
