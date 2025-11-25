import 'dotenv/config';
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Client } from '@notionhq/client';
import { searchInUser } from './search/query.js';

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

    if (!value || (value !== 'page' && value !== 'database')) {
      return res.status(400).json({ 
        error: 'El valor debe ser "page" o "database"' 
      });
    }

    if (!process.env.NOTION_TOKEN) {
      return res.status(500).json({ 
        error: 'NOTION_TOKEN no está configurado' 
      });
    }

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

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📝 Asegúrate de tener configurado NOTION_TOKEN en tu archivo .env`);
});

