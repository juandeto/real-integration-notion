## Installation

Install dependencies:
```bash
pnpm install
```

## Setup

Follow the [Authentication Guide](https://developers.notion.com/docs/authorization) to create your NOTION_TOKEN

It's very fast.

Create an `.env` file and add the NOTION_TOKEN:
```
NOTION_TOKEN=your_notion_token_here
```

## Running

Start the application:
```bash
pnpm run start
```

The server will start at `http://localhost:3000` (or the port specified in the `PORT` environment variable).

## Swagger Documentation

This project uses **Swagger UI** as the only interface to interact with the API. Once the server is running, you can access the interactive documentation at:

```
http://localhost:3000/api-docs
```

Or simply visit the root route which automatically redirects to Swagger:

```
http://localhost:3000
```

Swagger documentation allows you to:
- View all available endpoints
- Test each endpoint directly from the browser
- View request and response schemas
- Understand required and optional parameters
- Execute requests and see responses in real-time

### Available Endpoints

1. **Search** - Search for pages or databases in your workspace
   - Endpoint: `GET /api/search`
   - Parameters: `query` (optional) and `filter` (required: "page" or "data_source")

2. **Get Page** - Get the details of a page by its ID
   - Endpoint: `GET /api/pages/:id`

3. **Get Block** - Get the details of a block by its ID
   - Endpoint: `GET /api/blocks/:id`

4. **Get Database** - Get the details of a database by its ID
   - Endpoint: `GET /api/databases/:id`

## API Endpoints

All endpoints return JSON with the following structure:

**Success:**
```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**
```json
{
  "error": "Error message"
}
```

## Technologies Used

- **Express.js** - Web framework for Node.js
- **@notionhq/client** - Official Notion API client
- **Swagger UI** - Interactive API documentation
- **swagger-jsdoc** - Documentation generation from JSDoc comments

## Project Structure

```
real-notion-integration/
├── blocks/          # Functions to retrieve blocks
├── database/        # Functions to retrieve databases
├── pages/           # Functions to retrieve pages
├── search/          # Search functions
├── server.js        # Express server with Swagger
└── package.json     # Project dependencies
```

## Notes

- Swagger documentation is automatically generated from JSDoc comments in `server.js`
- All endpoints require a valid `NOTION_TOKEN` configured in the `.env` file
- The API follows the OpenAPI 3.0 standard


