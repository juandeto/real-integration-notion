async function getDatabase(databaseId) {
  const options = {method: 'GET', headers: {accept: 'application/json'}};

  const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}`, options);
  const data = await response.json();
  
  return data;
}

export {
  getDatabase,
};

