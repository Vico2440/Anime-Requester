import { getAll, validateApiKey, fetchGenres } from './api.js';
import { initializeSynopsisToggle, renderAnimeResult, renderGenresCheckbox } from './dom.js';

export function initForms() {
    const apiForm = document.getElementById('api-form');
    const searchForm = document.getElementById('search-form');
    const apiSection = document.getElementById('api-key-section');
    const searchSection = document.getElementById('search-section');
    const resultsContainer = document.getElementById('results-container');

    document.querySelectorAll('.anime-card-synopsis').forEach(initializeSynopsisToggle);

    async function loadDynamicGenres() {
        try {
            const genres = await fetchGenres();
            renderGenresCheckbox(genres);
        } catch (error) {
            console.error('Erreur chargement genres :', error);
        }
    }

    if (sessionStorage.getItem('apiKey')) {
        apiSection.style.display = 'none';
        searchSection.style.display = 'block';
        loadDynamicGenres();
    }

    apiForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const apiKeyInput = document.getElementById('api-key').value.trim();

        if (apiKeyInput === '') return;

        try {
            await validateApiKey(apiKeyInput);
            sessionStorage.setItem('apiKey', apiKeyInput);
            apiSection.style.display = 'none';
            searchSection.style.display = 'block';
            await loadDynamicGenres();
        } catch (error) {
            console.error(error.message);
            alert('Impossible de contacter le service ou entrée invalide.');
        }
    });

    searchForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const searchType = document.getElementById('search-type').value;
        const searchParam = document.getElementById('search-param').value.trim();

        const checkedGenres = Array.from(
            document.querySelectorAll('input[name="genre"]:checked')
        ).map(checkbox => checkbox.value);

        const searchData = {
            type: searchType,
            param: searchParam,
            genres: checkedGenres
        };

        try {
            if (resultsContainer) {
                resultsContainer.innerHTML = '<p class="loading-state text-center my-4">Recherche en cours...</p>';
            }

            const animes = await getAll(searchData);
            renderAnimeResult(animes);
        } catch (error) {
            console.error('API Error :', error);
            if (resultsContainer) {
                resultsContainer.innerHTML = `<p class="error-state text-danger text-center my-4">Erreur : ${error.message}</p>`;
            }
        }
    });

    searchForm.addEventListener('reset', () => {
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    });
}