const animeCache = new Map();
let genresCache = null;

export async function validateApiKey(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('Veuillez renseigner une clé.');
    }

    const response = await fetch('https://api.jikan.moe/v4/anime?limit=1');
    if (!response.ok) {
        throw new Error(`Erreur réseau (${response.status})`);
    }
    return true;
}

export async function fetchGenres() {
    if (genresCache) return genresCache;

    const response = await fetch('https://api.jikan.moe/v4/genres/anime');
    if (!response.ok) throw new Error('Impossible de récupérer les genres.');

    const result = await response.json();
    genresCache = result.data || [];
    return genresCache;
}

export async function getAll(searchData = {}) {
    const { type, param, genres } = searchData;

    if (type === 'id' && param) {
        const cacheKey = `https://api.jikan.moe/v4/anime/${encodeURIComponent(param)}`;
        if (animeCache.has(cacheKey)) {
            console.log(`[Cache Hit] ${cacheKey}`);
            return animeCache.get(cacheKey);
        }

        const response = await fetch(cacheKey);
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const result = await response.json();
        const data = result.data ? [result.data] : [];
        animeCache.set(cacheKey, data);
        return data;
    }

    if (type === 'ranking') {
        const targetPage = param && !isNaN(param) ? param : '1';
        const cacheKey = `https://api.jikan.moe/v4/top/anime?page=${targetPage}&limit=1`;
        if (animeCache.has(cacheKey)) {
            console.log(`[Cache Hit] ${cacheKey}`);
            return animeCache.get(cacheKey);
        }

        const response = await fetch(cacheKey);
        if (!response.ok) throw new Error(`Erreur ${response.status}`);
        const result = await response.json();
        const data = result.data || [];
        animeCache.set(cacheKey, data);
        return data;
    }

    const url = new URL('https://api.jikan.moe/v4/anime');
    url.searchParams.append('limit', '10');

    if (param) {
        url.searchParams.append('q', param);
    }

    if (Array.isArray(genres) && genres.length > 0) {
        url.searchParams.append('genres', genres.join(','));
    }

    const cacheKey = url.toString();
    if (animeCache.has(cacheKey)) {
        console.log(`[Cache Hit] ${cacheKey}`);
        return animeCache.get(cacheKey);
    }

    const response = await fetch(cacheKey);
    if (!response.ok) {
        throw new Error(`Erreur ${response.status} : impossible de récupérer les données.`);
    }

    const result = await response.json();
    const data = result.data || [];
    animeCache.set(cacheKey, data);
    return data;
}