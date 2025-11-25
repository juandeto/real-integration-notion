async function getDatabase(notion, databaseId) {
  const response = await notion.databases.retrieve({
    database_id: databaseId,
  });
  return response;
}

export {
  getDatabase,
};

