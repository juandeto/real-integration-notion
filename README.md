## Installation

Install dependencies:
```bash
pnpm install
```

## Setup

Follow the [Authentication Guide](https://developers.notion.com/docs/authorization) to create your NOTION_TOKEN

Is very fast.

Create an .env and add the NOTION_TOKEN

## Running

Start the application:
```bash
pnpm run start
```

El servidor se iniciará en `http://localhost:3000` (o el puerto especificado en la variable de entorno `PORT`).

## Interfaz Web

Una vez que el servidor esté corriendo, puedes acceder a la interfaz web interactiva en:

```
http://localhost:3000
```

La interfaz web te permite probar todas las funciones de la API de Notion disponibles:

### Funciones Disponibles

1. **Search** - Buscar páginas o bases de datos en tu workspace
   - Endpoint: `POST /api/search`
   - Parámetros: `{ "value": "page" | "database" }`

2. **Get Page** - Obtener los detalles de una página por su ID
   - Endpoint: `GET /api/pages/:id`

3. **Get Block** - Obtener los detalles de un bloque por su ID
   - Endpoint: `GET /api/blocks/:id`

4. **Get Database** - Obtener los detalles de una base de datos por su ID
   - Endpoint: `GET /api/databases/:id`

La interfaz muestra los resultados en formato JSON formateado y maneja errores de manera clara.

## API Endpoints

Todos los endpoints devuelven JSON con la siguiente estructura:

**Éxito:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "error": "Mensaje de error"
}
```


