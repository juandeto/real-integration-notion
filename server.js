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
 *   post:
 *     summary: Busca páginas o bases de datos en el workspace de Notion
 *     tags: [Search]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *                 enum: [page, data_source]
 *                 description: Tipo de búsqueda - 'page' para páginas o 'data_source' para bases de datos
 *                 example: page
 */
app.post('/api/search', async (req, res) => {
  try {
    const { value } = req.body;
  } catch (error) {
    console.error('Error al buscar:', error);
    res.status(500).json({ error: error.message || 'Error al buscar' });
  }
});

/**
 * @swagger
 * /api/pages/{id}:
 *   get:
 *     summary: Obtiene los detalles de una página específica por su ID
 *     tags: [Pages]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la página de Notion
 *         example: 59833787-2cf9-4fdf-8782-e53db20768a5
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



