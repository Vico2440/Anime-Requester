export async function getAll(filters = {}) {
    const apiKey = sessionStorage.getItem('rapidapi_key');
    if(!apiKey) throw new Error('Missing API Key');

    const url = new URL('https://anime-db.p.rapidapi.com/anime');

    url.searchParams.append('page', '1');
    url.searchParams.append('size', '10');

    if (filters.search) {
        url.searchParams.append('search', filters.search);
    }
    if (filters.genres) {
        url.searchParams.append('genres', filters.genres);
    }
    if (filters.sortBy) {
        url.searchParams.append('sortBy', filters.sortBy);
        url.searchParams.append('sortOrder', 'asc');
    }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'anime-db.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
}