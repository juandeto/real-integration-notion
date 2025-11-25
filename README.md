## Installation

Install dependencies:
```bash
pnpm install
```

## Setup

Follow the [Authentication Guide](https://developers.notion.com/docs/authorization) to create your NOTION_TOKEN

Is very fast.

Create an `.env` file and add the NOTION_TOKEN:
```
NOTION_TOKEN=your_notion_token_here
```

## Running

Start the application:
```bash
pnpm run start
```

El servidor se iniciará en `http://localhost:3000` (o el puerto especificado en la variable de entorno `PORT`).

## Documentación Swagger

Este proyecto utiliza **Swagger UI** como única interfaz para interactuar con la API. Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva en:

```
http://localhost:3000/api-docs
```

O simplemente visita la ruta raíz que redirige automáticamente a Swagger:

```
http://localhost:3000
```

La documentación Swagger te permite:
- Ver todos los endpoints disponibles
- Probar cada endpoint directamente desde el navegador
- Ver los esquemas de request y response
- Entender los parámetros requeridos y opcionales
- Ejecutar requests y ver respuestas en tiempo real

### Endpoints Disponibles

1. **Search** - Buscar páginas o bases de datos en tu workspace
   - Endpoint: `POST /api/search`
   - Parámetros: `{ "value": "page" | "data_source" }`

2. **Get Page** - Obtener los detalles de una página por su ID
   - Endpoint: `GET /api/pages/:id`

3. **Get Block** - Obtener los detalles de un bloque por su ID
   - Endpoint: `GET /api/blocks/:id`

4. **Get Database** - Obtener los detalles de una base de datos por su ID
   - Endpoint: `GET /api/databases/:id`

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

## Tecnologías Utilizadas

- **Express.js** - Framework web para Node.js
- **@notionhq/client** - Cliente oficial de la API de Notion
- **Swagger UI** - Documentación interactiva de la API
- **swagger-jsdoc** - Generación de documentación desde comentarios JSDoc

## Estructura del Proyecto

```
real-notion-integration/
├── blocks/          # Funciones para obtener bloques
├── database/        # Funciones para obtener bases de datos
├── pages/           # Funciones para obtener páginas
├── search/          # Funciones de búsqueda
├── server.js        # Servidor Express con Swagger
└── package.json     # Dependencias del proyecto
```

## Notas

- La documentación Swagger se genera automáticamente desde los comentarios JSDoc en `server.js`
- Todos los endpoints requieren un `NOTION_TOKEN` válido configurado en el archivo `.env`
- La API sigue el estándar OpenAPI 3.0


