const template = document.querySelector('#anime-card-template');
const container = document.querySelector('#results-container');
let synopsisId = 0;

export function initializeSynopsisToggle(synopsisEl) {
    if (!synopsisEl) return;
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

export function renderGenresCheckbox(genresList) {
    const genreContainer = document.getElementById('genres-list-container');
    if (!genreContainer) return;

    genreContainer.innerHTML = '';
    const fragment = document.createDocumentFragment();

    genresList.forEach(genre => {
        const label = document.createElement('label');
        label.className = 'form-check-label';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = 'genre';
        input.value = genre.mal_id;
        input.className = 'form-check-input me-1';

        label.appendChild(input);
        label.append(` ${genre.name}`);
        fragment.appendChild(label);
    });

    genreContainer.appendChild(fragment);
}

export function renderAnimeResult(animes) {
    container.innerHTML = '';

    if (!animes || animes.length === 0) {
        container.innerHTML = '<p class="empty-state text-center text-muted my-4">Aucun anime trouvé.</p>';
        return;
    }

    const fragment = document.createDocumentFragment();

    animes.forEach(anime => {
        const clone = template.content.cloneNode(true);

        const title = clone.querySelector('.anime-card-title');
        title.textContent = anime.title || 'Titre inconnu';

        const image = clone.querySelector('.anime-card-image');
        const posterUrl = anime.images?.jpg?.image_url || anime.images?.webp?.image_url;
        image.src = posterUrl || './assets/placeholder.jpg';
        image.alt = anime.title ? `Affiche de ${anime.title}` : "Affiche de l'anime";
        image.loading = 'lazy';

        const synopsisEl = clone.querySelector('.anime-card-synopsis');
        synopsisEl.textContent = anime.synopsis
            ? `Synopsis : ${anime.synopsis}`
            : 'Synopsis : Non disponible.';

        const genresEl = clone.querySelector('.anime-card-genres');
        const genreNames = Array.isArray(anime.genres) ? anime.genres.map(g => g.name).join(', ') : '';
        genresEl.textContent = genreNames ? `Genres : ${genreNames}` : 'Genres : N/A';

        const rankingEl = clone.querySelector('.anime-card-ranking');
        rankingEl.textContent = anime.rank ? `Classement : #${anime.rank}` : 'Classement : N/C';

        const episodesEl = clone.querySelector('.anime-card-nb-episodes');
        episodesEl.textContent = `Épisodes : ${anime.episodes ?? 'Inconnu'}`;

        fragment.appendChild(clone);
    });

    container.appendChild(fragment);

    container.querySelectorAll('.anime-card-synopsis').forEach(initializeSynopsisToggle);
}