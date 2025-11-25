import 'dotenv/config';
import { Client } from '@notionhq/client';
import { getUserPage } from './pages/index.js';
import { searchInUser } from './search/query.js';


const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export {
  notion,
};

// get all pages of the user
const res = await searchInUser(notion, 'page')
const firstPageId = res.results?.[0]?.id;

// Get the first page of the user
const firstPage = await getUserPage(notion, firstPageId);
console.log('firstPage', firstPage);

// retrieve a block
const blockId = 'insert-a-block-id-here'; // get a block id with notion
const block = await retrieveBlock(notion, blockId);
console.log('block', block);


// you can try the same for databases, just use database id instead of page id
// in searchInUser function
