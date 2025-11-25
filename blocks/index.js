async function retrieveBlock(notion, blockId) {
  const response = await notion.blocks.retrieve({
    block_id: blockId,
  });
  return response;
}

module.exports = { retrieveBlock };