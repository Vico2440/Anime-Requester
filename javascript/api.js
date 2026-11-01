const showCache = new Map();

export async function validateApiKey(apiKey) {
    if (!apiKey || apiKey.trim() === '') {
        throw new Error('Veuillez renseigner une clé.');
    }
    const response = await fetch('https://api.tvmaze.com/shows/1');
    if (!response.ok) {
        throw new Error(`Erreur réseau TVMaze (${response.status})`);
    }
    return true;
}

export async function fetchGenres() {
    return [
        { id: 'Action', name: 'Action' },
        { id: 'Adventure', name: 'Aventure' },
        { id: 'Anime', name: 'Anime' },
        { id: 'Comedy', name: 'Comédie' },
        { id: 'Drama', name: 'Drame' },
        { id: 'Fantasy', name: 'Fantastique' },
        { id: 'Romance', name: 'Romance' },
        { id: 'Science-Fiction', name: 'Science-Fiction' },
        { id: 'Supernatural', name: 'Surnaturel' },
        { id: 'Thriller', name: 'Thriller' }
    ];
}

export async function getAll(searchData = {}) {
    const { type, param, genres } = searchData;

    if (type === 'id' && param) {
        const url = `https://api.tvmaze.com/shows/${encodeURIComponent(param)}`;
        if (showCache.has(url)) {
            console.log(`[Cache Hit] ${url}`);
            return showCache.get(url);
        }

        const response = await fetch(url);
        if (!response.ok) throw new Error(`Aucune série trouvée avec l'ID ${param}`);
        const show = await response.json();

        const data = [{
            title: show.name,
            image: show.image?.medium || show.image?.original || '',
            synopsis: show.summary ? show.summary.replace(/<[^>]*>/g, '') : 'Synopsis non disponible.',
            ranking: show.rating?.average ? `${show.rating.average}/10` : 'N/C',
            episodes: show.status || 'Inconnu',
            genres: show.genres || []
        }];

        showCache.set(url, data);
        return data;
    }

    const query = param || (Array.isArray(genres) && genres.length > 0 ? genres[0] : 'anime');
    const url = `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`;

    if (showCache.has(url)) {
        console.log(`[Cache Hit] ${url}`);
        return showCache.get(url);
    }

    const response = await fetch(url);
    if (!response.ok) throw new Error(`Erreur ${response.status}`);
    const results = await response.json();

    let data = results.map(entry => {
        const s = entry.show;
        return {
            title: s.name,
            image: s.image?.medium || s.image?.original || '',
            synopsis: s.summary ? s.summary.replace(/<[^>]*>/g, '') : 'Synopsis non disponible.',
            ranking: s.rating?.average ? `${s.rating.average}/10` : 'N/C',
            episodes: s.status || 'Inconnu',
            genres: s.genres || []
        };
    });

    if (Array.isArray(genres) && genres.length > 0) {
        data = data.filter(item =>
            genres.some(selectedGenre => item.genres.includes(selectedGenre))
        );
    }

    if (type === 'ranking') {
        data.sort((a, b) => {
            const noteA = parseFloat(a.ranking) || 0;
            const noteB = parseFloat(b.ranking) || 0;
            return noteB - noteA;
        });
        data = data.slice(0, 1);
    }

    showCache.set(url, data);
    return data;
}