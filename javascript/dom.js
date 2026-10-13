const template = document.querySelector('#anime-card-template');
const container = document.querySelector('#results-container');
let synopsisId = 0;

export function initializeSynopsisToggle(synopsisEl) {
    const button = synopsisEl.nextElementSibling;
    if (!button?.classList.contains('anime-card-synopsis-toggle')) return;

    synopsisEl.classList.add('is-collapsed');
    button.hidden = synopsisEl.scrollHeight <= synopsisEl.clientHeight;

    if (button.hidden) return;

    if (!synopsisEl.id) {
        synopsisEl.id = `anime-synopsis-${++synopsisId}`;
    }
    button.setAttribute('aria-controls', synopsisEl.id);

    button.addEventListener('click', () => {
        const isExpanded = synopsisEl.classList.toggle('is-collapsed') === false;
        button.textContent = isExpanded ? 'Afficher moins' : 'Afficher plus';
        button.setAttribute('aria-expanded', String(isExpanded));
    });
}

export function renderAnimeResult(animes) {

    container.innerHTML = '';

    if(!animes || animes.length === 0)
    {
        container.innerHTML = '<p class="empty-state">Aucun anime trouvé.</p>';
        return;
    }

    animes.forEach(anime => {
        const clone = template.content.cloneNode(true);

        const title = clone.querySelector('.anime-card-title');
        title.textContent = anime.title || 'Missing Title';

        const image = clone.querySelector('.anime-card-image');
        image.src = anime.image;
        image.alt = '';

        const synopsisEl = clone.querySelector('.anime-card-synopsis');
        synopsisEl.textContent = anime.synopsis
            ? `Synopsis : ${anime.synopsis}`
            : 'Synopsis : Non disponible.';

        const genresEl = clone.querySelector('.anime-card-genres');
        genresEl.textContent = Array.isArray(anime.genres) && anime.genres.length > 0
            ? anime.genres.join(', ')
            : 'N/A';

        const rankingEl = clone.querySelector('.anime-card-ranking');
        rankingEl.textContent = anime.ranking ? `#${anime.ranking}` : 'N/C';

        const episodesEl = clone.querySelector('.anime-card-nb-episodes');
        episodesEl.textContent = anime.episodes ?? 'Inconnu';

        container.appendChild(clone);
        initializeSynopsisToggle(container.lastElementChild.querySelector('.anime-card-synopsis'));
    })
}