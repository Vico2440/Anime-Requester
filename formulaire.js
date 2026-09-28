
export function initForms() {
    console.log("Le fichier JS est bien connecté !");


    const apiForm = document.getElementById('api-form');
    const searchForm = document.getElementById('search-form');
    const apiSection = document.getElementById('api-key-section');
    const searchSection = document.getElementById('search-section');

    if (sessionStorage.getItem('apiKey')) {
        apiSection.style.display = 'none';
        searchSection.style.display = 'block';
    }

    apiForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const apiKeyInput = document.getElementById('api-key').value;
        
        if (apiKeyInput.trim() !== "") {
            sessionStorage.setItem('apiKey', apiKeyInput.trim());
            
            apiSection.style.display = 'none';
            searchSection.style.display = 'block';
        }
    });

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        
        // Récupération des valeurs
        const searchType = document.getElementById('search-type').value;
        const searchParam = document.getElementById('search-param').value;
        
        const checkedGenres = Array.from(document.querySelectorAll('input[name="genre"]:checked'))
        .map(checkbox => checkbox.value);

        const searchData = {
            type: searchType,
            param: searchParam,
            genres: checkedGenres
        };

        console.log("Données prêtes à être envoyées à l'API :", searchData);
        console.log("Clé API utilisée :", sessionStorage.getItem('apiKey'));
        
    });
}