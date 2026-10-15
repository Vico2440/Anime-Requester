const template = document.querySelector('#anime-card-template');
const container = document.querySelector('#results-container');
let synopsisId = 0;
let currentCards = [];
let lastColCount = 0;

function getColumnCount() {
    if (window.innerWidth >= 992) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
}

export function distributeCards(cards) {
    if (!container) return;
    currentCards = cards || [];
    if (currentCards.length === 0) return;

    const colCount = getColumnCount();
    lastColCount = colCount;

    container.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row g-4 justify-content-center';

    const colClass = colCount === 3
        ? 'col-lg-4 col-md-6 col-12'
        : (colCount === 2 ? 'col-md-6 col-12' : 'col-12');

    const cols = [];
    for (let i = 0; i < colCount; i++) {
        const col = document.createElement('div');
        col.className = `${colClass} d-flex flex-column gap-4`;
        cols.push(col);
        row.appendChild(col);
    }

    currentCards.forEach((card, index) => {
        cols[index % colCount].appendChild(card);
    });

    container.appendChild(row);
}

export function initializeSynopsisToggle(synopsisEl) {
    const button = synopsisEl.nextElementSibling;
    if (!button?.classList.contains('anime-card-synopsis-toggle')) return;

    synopsisEl.classList.add('is-collapsed');
    button.textContent = 'Afficher plus';
    button.hidden = synopsisEl.scrollHeight <= synopsisEl.clientHeight;

    if (button.hidden) return;

    if (!synopsisEl.id) {
        synopsisEl.id = `anime-synopsis-${++synopsisId}`;
    }
    button.setAttribute('aria-controls', synopsisEl.id);

    button.addEventListener('click', () => {
        const willExpand = synopsisEl.classList.contains('is-collapsed');

        if (willExpand) {
            document.querySelectorAll('.anime-card-synopsis:not(.is-collapsed)').forEach(otherSynopsis => {
                otherSynopsis.classList.add('is-collapsed');
                const otherButton = otherSynopsis.nextElementSibling;
                if (otherButton?.classList.contains('anime-card-synopsis-toggle')) {
                    otherButton.textContent = 'Afficher plus';
                    otherButton.setAttribute('aria-expanded', 'false');
                }
            });

            synopsisEl.classList.remove('is-collapsed');
            button.textContent = 'Afficher moins';
            button.setAttribute('aria-expanded', 'true');
        } else {
            synopsisEl.classList.add('is-collapsed');
            button.textContent = 'Afficher plus';
            button.setAttribute('aria-expanded', 'false');
        }
    });
}

export function clearResults() {
    currentCards = [];
    if (container) {
        container.innerHTML = '';
    }
}

export function initCardsLayout() {
    if (!container) return;
    const existingCards = Array.from(container.querySelectorAll('.anime-card'));
    if (existingCards.length > 0) {
        existingCards.forEach(card => {
            const synopsisEl = card.querySelector('.anime-card-synopsis');
            if (synopsisEl) {
                initializeSynopsisToggle(synopsisEl);
            }
        });
        distributeCards(existingCards);
    }
}

export function renderAnimeResult(animes) {
    if (!container) return;

    clearResults();

    if (!animes || animes.length === 0) {
        container.innerHTML = '<p class="empty-state text-center w-100 my-4">Aucun anime trouvé.</p>';
        return;
    }

    const cards = animes.map(anime => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.anime-card');

        const title = card.querySelector('.anime-card-title');
        title.textContent = anime.title || 'Missing Title';

        const image = card.querySelector('.anime-card-image');
        image.src = anime.image;
        image.alt = '';

        const synopsisEl = card.querySelector('.anime-card-synopsis');
        synopsisEl.textContent = anime.synopsis
            ? `Synopsis : ${anime.synopsis}`
            : 'Synopsis : Non disponible.';

        const genresEl = card.querySelector('.anime-card-genres');
        genresEl.textContent = Array.isArray(anime.genres) && anime.genres.length > 0
            ? anime.genres.join(', ')
            : 'N/A';

        const rankingEl = card.querySelector('.anime-card-ranking');
        rankingEl.textContent = anime.ranking ? `#${anime.ranking}` : 'N/C';

        const episodesEl = card.querySelector('.anime-card-nb-episodes');
        episodesEl.textContent = anime.episodes ?? 'Inconnu';

        initializeSynopsisToggle(synopsisEl);
        return card;
    });

    distributeCards(cards);
}

window.addEventListener('resize', () => {
    if (currentCards.length === 0) return;
    const newColCount = getColumnCount();
    if (newColCount !== lastColCount) {
        distributeCards(currentCards);
    }
});