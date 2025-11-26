import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Client } from '@notionhq/client';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { searchInUser } from './search/query.js';
import { getUserPage } from './pages/index.js';
import { retrieveBlock } from './blocks/index.js';
import { getDatabase } from './database/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notion API Integration',
      version: '1.0.0',
      description: 'API para interactuar con la API pública de Notion',
      contact: {
        name: 'Juan de Tomaso',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Servidor de desarrollo',
      },
    ],
  },
  apis: ['./server.js'], // Path to the API files
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Notion API Documentation',
}));

// Redirect root to Swagger UI
app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: Busca páginas o bases de datos en el workspace de Notion
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Término de búsqueda (opcional). Filtra por el Title del objeto
 *         example: mi página
 *       - in: query
 *         name: filter
 *         required: true
 *         schema:
 *           type: string
 *           enum: [page, data_source]
 *         description: Tipo de búsqueda - 'page' para páginas o 'data_source' para data sources
 *         example: page
 *     responses:
 *       200:
 *         description: Búsqueda exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                 has_more:
 *                   type: boolean
 *                 next_cursor:
 *                   type: string
 *                   nullable: true
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
app.get('/api/search', async (req, res) => {
  try {
    const { query = '', filter } = req.query;

    if (!filter) {
      return res.status(400).json({ 
        error: 'El parámetro "filter" es requerido. Debe ser "page" o "data_source"' 
      });
    }

    if (filter !== 'page' && filter !== 'data_source') {
      return res.status(400).json({ 
        error: 'El parámetro "filter" debe ser "page" o "data_source"' 
      });
    }

    if (!process.env.NOTION_TOKEN) {
      return res.status(500).json({ 
        error: 'NOTION_TOKEN no está configurado' 
      });
    }

    const response = await searchInUser(notion, query, filter);
    
    res.json(response);
  } catch (error) {
    console.error('Error al buscar:', error);
    res.status(500).json({ 
      error: error.message || 'Error al realizar la búsqueda' 
    });
  }
});

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     summary: Obtiene los detalles de una página específica por su ID
 *     tags: [Page]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página de Notion
 *         example: 59833787-2cf9-4fdf-8782-e53db20768a5
 *     responses:
 *       200:
 *         description: Página obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Objeto de página de Notion con todas sus propiedades
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Page ID es requerido
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.get('/api/pages/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: 'Page ID es requerido' 
      });
    }

    if (!process.env.NOTION_TOKEN) {
      return res.status(500).json({ 
        error: 'NOTION_TOKEN no está configurado' 
      });
    }

    const response = await getUserPage(notion, id);

    console.log('response', response);
    
    res.json(response);
  } catch (error) {
    console.error('Error al obtener la página:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener la página' 
    });
  }
});

/**
 * @swagger
 * /api/blocks/{id}:
 *   get:
 *     summary: Obtiene los detalles de un bloque específico por su ID
 *     tags: [Blocks]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del bloque de Notion
 *         example: insert-a-block-id-here
 *     responses:
 *       200:
 *         description: Bloque obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Objeto de bloque de Notion con todas sus propiedades
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Block ID es requerido
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.get('/api/blocks/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: 'Block ID es requerido' 
      });
    }

    if (!process.env.NOTION_TOKEN) {
      return res.status(500).json({ 
        error: 'NOTION_TOKEN no está configurado' 
      });
    }

    const response = await retrieveBlock(notion, id);
    
    res.json(response);
  } catch (error) {
    console.error('Error al obtener el bloque:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener el bloque' 
    });
  }
});

/**
 * @swagger
 * /api/databases/{id}:
 *   get:
 *     summary: Obtiene los detalles de una base de datos específica por su ID
 *     tags: [Databases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la base de datos de Notion
 *         example: database-id-here
 *     responses:
 *       200:
 *         description: Base de datos obtenida exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Objeto de base de datos de Notion con todas sus propiedades
 *       400:
 *         description: Error de validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Database ID es requerido
 *       500:
 *         description: Error del servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.get('/api/databases/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ 
        error: 'Database ID es requerido' 
      });
    }

    if (!process.env.NOTION_TOKEN) {
      return res.status(500).json({ 
        error: 'NOTION_TOKEN no está configurado' 
      });
    }

    const response = await getDatabase(notion, id);
    
    res.json(response);
  } catch (error) {
    console.error('Error al obtener la base de datos:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener la base de datos' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📚 Documentación Swagger disponible en http://localhost:${PORT}/api-docs`);
  console.log(`📝 Asegúrate de tener configurado NOTION_TOKEN en tu archivo .env`);
});



