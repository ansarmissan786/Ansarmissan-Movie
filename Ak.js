   <script type="module">
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
        import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

        const firebaseConfig = {
  apiKey: "AIzaSyDuj2qSg1bp0xD9DRycwN-ilm7G8Ta1wac",
  authDomain: "nfgmovie.firebaseapp.com",
  databaseURL: "https://nfgmovie-default-rtdb.firebaseio.com",
  projectId: "nfgmovie",
  storageBucket: "nfgmovie.firebasestorage.app",
  messagingSenderId: "817690106012",
  appId: "1:817690106012:web:70ba4634d03603f677f559",
  measurementId: "G-L6KK21QM98"
};
        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        const moviesRef = ref(database, 'movies/');

        const mainAppView = document.getElementById('main-app-view');
        const listViewContainer = document.getElementById('list-view-container');
        const loaderContainer = document.getElementById('loader-container');
        const categoriesContainer = document.getElementById('categories-container');
        const searchBar = document.getElementById('search-bar');
        const searchResultsContainer = document.getElementById('search-results-container');
        const searchGrid = document.getElementById('search-grid');
        const listItemsGrid = document.getElementById('list-items-grid');
        const detailsOverlay = document.getElementById('movie-details-overlay');
        
        let allMovies = [];

        onValue(moviesRef, (snapshot) => {
            if (!snapshot.exists()) { loaderContainer.innerHTML = '<p class="message">No movies found.</p>'; return; }
            const data = snapshot.val();
            allMovies = Object.keys(data).map(key => ({ id: key, ...data[key] }));
            const groupedMovies = allMovies.reduce((acc, movie) => {
                const category = movie.category || 'Uncategorized';
                if (!acc[category]) acc[category] = [];
                acc[category].push(movie);
                return acc;
            }, {});
            loaderContainer.style.display = 'none';
            categoriesContainer.style.display = 'block';
            displayMoviesByCategory(groupedMovies);
        }, { onlyOnce: true });

        function createMovieCard(movie) {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            movieCard.dataset.movieId = movie.id; 
            movieCard.innerHTML = `<img src="${movie.posterUrl}" alt="${movie.title}" onerror="this.onerror=null;this.src='https://via.placeholder.com/180x250.png?text=No+Image';"><div class="card-overlay"></div>`;
            return movieCard;
        }

        function displayMoviesByCategory(groupedMovies) {
            categoriesContainer.innerHTML = '';
            const categoryOrder = ["Hollywood Movies", "Bollywood Movies", "South Indian Movies", "Web Series", "Comedy Movies", "Animation Movies"];
            for (const category of categoryOrder) {
                if (!groupedMovies[category]) continue;
                const section = document.createElement('section');
                section.className = 'category-section';
                section.innerHTML = `<div class="category-header"><h2 class="category-title">${category}</h2><button class="view-all-btn" data-category="${category}">View All →</button></div>`;
                const row = document.createElement('div');
                row.className = 'movie-row';
                groupedMovies[category].slice(0, 15).forEach(movie => row.appendChild(createMovieCard(movie)));
                section.appendChild(row);
                categoriesContainer.appendChild(section);
            }
        }

        function createListItemCard(movie) {
            const listItem = document.createElement('div');
            listItem.className = 'list-item-card';
            listItem.dataset.movieId = movie.id;
            listItem.innerHTML = `<img src="${movie.posterUrl}" alt="${movie.title}" onerror="this.style.display='none'"><div class="info"><h3 class="title">${movie.title}</h3></div>`;
            return listItem;
        }

        function showListView(categoryName) {
            mainAppView.style.display = 'none';
            listViewContainer.style.display = 'block';
            const categoryMovies = allMovies.filter(m => m.category === categoryName);
            listItemsGrid.innerHTML = '';
            if (categoryMovies.length > 0) {
                categoryMovies.slice().reverse().forEach(movie => listItemsGrid.appendChild(createListItemCard(movie)));
            } else {
                listItemsGrid.innerHTML = `<p class="message">No movies in this category.</p>`;
            }
        }
        
        function showHomePage() {
            listViewContainer.style.display = 'none';
            mainAppView.style.display = 'block';
            searchResultsContainer.style.display = 'none';
            categoriesContainer.style.display = 'block';
            searchBar.value = '';
        }
        document.querySelector('.logo').addEventListener('click', showHomePage);
        document.getElementById('list-view-back-btn').addEventListener('click', showHomePage);

        searchBar.addEventListener('input', () => {
            const searchTerm = searchBar.value.toLowerCase().trim();
            if (searchTerm === '') { showHomePage(); return; }
            categoriesContainer.style.display = 'none';
            searchResultsContainer.style.display = 'block';
            const filteredMovies = allMovies.filter(m => m.title.toLowerCase().includes(searchTerm));
            searchGrid.innerHTML = '';
            if (filteredMovies.length > 0) {
                filteredMovies.forEach(movie => searchGrid.appendChild(createMovieCard(movie)));
            } else {
                searchGrid.innerHTML = `<p class="message">No movies found for '${searchBar.value}'</p>`;
            }
        });

        function showMovieDetails(movieId) {
            const movie = allMovies.find(m => m.id === movieId);
            if (!movie) return;
            document.getElementById('details-img').src = movie.posterUrl;
            document.getElementById('details-title').textContent = movie.title;
            document.getElementById('details-category').textContent = movie.category;
            document.getElementById('details-download-btn').href = movie.movieUrl;
            detailsOverlay.classList.add('visible');
        }
        
        document.body.addEventListener('click', (e) => {
            const movieCard = e.target.closest('.movie-card, .list-item-card');
            if (movieCard) { showMovieDetails(movieCard.dataset.movieId); return; }
            if (e.target.classList.contains('view-all-btn')) { showListView(e.target.dataset.category); }
        });
        
        const sidenav = document.getElementById('sidenav');
        document.getElementById('menu-btn').addEventListener('click', () => sidenav.classList.add('active'));
        document.getElementById('close-menu-btn').addEventListener('click', () => sidenav.classList.remove('active'));
        document.getElementById('back-btn').addEventListener('click', () => detailsOverlay.classList.remove('visible'));

    </script>