
async function searchInUser(notion, value){
    try {
        
    const response = await notion.search({
        query: '',
        filter: {
          value: value,
          property: 'object'
        },
        sort: {
          direction: 'ascending',
          timestamp: 'last_edited_time'
        },
      });


      return response;
    } catch (error) {
        console.error('error', error);
    }
}



export {
    searchInUser,
};