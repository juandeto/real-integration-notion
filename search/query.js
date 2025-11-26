async function searchInUser(notion, query = '', filter = 'page') {
    try {
        const searchOptions = {
            query: query,
            filter: {
                value: filter,
                property: 'object'
            },
            sort: {
                direction: 'ascending',
                timestamp: 'last_edited_time'
            },
        };

        const response = await notion.search(searchOptions);

        return response;
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        throw error;
    }
}



export {
    searchInUser,
};