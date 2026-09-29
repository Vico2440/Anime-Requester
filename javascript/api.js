export async function getAll(searchData = {}) {
    const apiKey = sessionStorage.getItem('apiKey');
    if (!apiKey) throw new Error('API key not found in the session.');

    const { type, param, genres } = searchData;

    if (type === 'id' && param) {
        const response = await fetch(`https://anime-db.p.rapidapi.com/anime/by-id/${encodeURIComponent(param)}`, {
            method: 'GET',
            headers: {
                'x-rapidapi-key': apiKey,
                'x-rapidapi-host': 'anime-db.p.rapidapi.com'
            }
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);
        const result = await response.json();
        return result ? [result] : [];
    }

    const url = new URL('https://anime-db.p.rapidapi.com/anime');
    url.searchParams.append('page', '1');

    if (type === 'ranking') {
        url.searchParams.append('size', '1');
        url.searchParams.append('sortBy', 'ranking');
        url.searchParams.append('sortOrder', 'asc');
        if (param) url.searchParams.append('page', param);
    } else {
        url.searchParams.append('size', '10');
        if (param) {
            url.searchParams.append('search', param);
        }
    }

    if (Array.isArray(genres) && genres.length > 0) {
        url.searchParams.append('genres', genres.join(','));
    }

    const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'anime-db.p.rapidapi.com'
        }
    });

    if (!response.ok) {
        throw new Error(`Error ${response.status} : impossible to recover the data.`);
    }

    const result = await response.json();
    return result.data || [];
}