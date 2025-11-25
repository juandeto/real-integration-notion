import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Client } from '@notionhq/client';
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
app.use(express.static(__dirname));

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

// API endpoint for search
app.post('/api/search', async (req, res) => {
  try {
    const { value } = req.body;

    console.log('value', value);
    const response = await searchInUser(notion, value);
    
    res.json({
      success: true,
      results: response.results || [],
      hasMore: response.has_more || false,
      nextCursor: response.next_cursor || null
    });
  } catch (error) {
    console.error('Error en la búsqueda:', error);
    res.status(500).json({ 
      error: error.message || 'Error al realizar la búsqueda' 
    });
  }
});

// API endpoint for getting a page by ID
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
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error al obtener la página:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener la página' 
    });
  }
});

// API endpoint for getting a block by ID
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
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error al obtener el bloque:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener el bloque' 
    });
  }
});

// API endpoint for getting a database by ID
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
    
    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    console.error('Error al obtener la base de datos:', error);
    res.status(500).json({ 
      error: error.message || 'Error al obtener la base de datos' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Asegúrate de tener configurado NOTION_TOKEN en tu archivo .env`);
});



