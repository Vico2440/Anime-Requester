import { getAll } from './api.js';
import { renderAnimeResult } from './dom.js';

export function initForms() {
    const apiForm = document.getElementById('api-form');
    const searchForm = document.getElementById('search-form');
    const apiSection = document.getElementById('api-key-section');
    const searchSection = document.getElementById('search-section');
    const resultsContainer = document.getElementById('results-container');

    if (sessionStorage.getItem('apiKey')) {
        apiSection.style.display = 'none';
        searchSection.style.display = 'block';
    }

    apiForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const apiKeyInput = document.getElementById('api-key').value;

        if (apiKeyInput.trim() !== '') {
            sessionStorage.setItem('apiKey', apiKeyInput.trim());
            apiSection.style.display = 'none';
            searchSection.style.display = 'block';
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
                resultsContainer.innerHTML = '<p class="loading-state">Recherche en cours</p>';
            }

            const animes = await getAll(searchData);

            renderAnimeResult(animes);
        } catch (error) {
            console.error('API Error :', error);
            if (resultsContainer) {
                resultsContainer.innerHTML = `<p class="error-state">Erreur : ${error.message}</p>`;
            }
        }
    });

    searchForm.addEventListener('reset', () => {
        if (resultsContainer) {
            resultsContainer.innerHTML = '';
        }
    });
}