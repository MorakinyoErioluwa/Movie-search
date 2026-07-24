// OMDb API Key
const apiKey = "b50923c";

// Store latest search
let currentMovies = [];
let currentSearch = "";

// Selecting DOM Elements
const searchInput = document.getElementById("searchInput");
const searchForm = document.getElementById("searchForm");
const results = document.getElementById("results");
const resultsHeader = document.getElementById("resultsHeader");
const resultsTitle = document.getElementById("resultsTitle");
const resultsCount = document.getElementById("resultsCount");

// Display Movies
function displayMovies(movies) {

    let movieCards = "";

    movies.forEach(function (movie) {

        movieCards += `
            <div
                class="movie-card group opacity-0 translate-y-5 bg-slate-800/80 backdrop-blur-md
                border border-slate-700 rounded-2xl overflow-hidden cursor-pointer transition-all 
                duration-300 hover:-translate-y-2 hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-900/30"
                data-id="${movie.imdbID}">

                <img
                    // loading="lazy"
                    // src="${movie.Poster}"
                    // alt="${movie.Title}"
                    // class="w-full h-80 object-contain transition-transform duration-500 group-hover:scale-105"
                    // onerror="this.src='https://placehold.co/300x450?text=No+Poster'"
                >

                <div class="p-4 text-center space-y-2">

                    <h2 class="text-base font-semibold text-white line-clamp-2 min-h-[48px]">
                        ${movie.Title}
                    </h2>

                    <p class="text-slate-500 text-sm mt-2">
                        ${movie.Year}
                    </p>

                    <span class="inline-flex items-center justify-center mt-3 bg-slate-700 text-xs px-3 py-1 rounded-full text-white font-medium">
                        ${movie.Type === "movie" ? "Movie" : movie.Type === "series" ? "Series" : "Other"}
                    </span>

                </div>

            </div>
        `;
    });

    // Update the results container with movie cards
    results.innerHTML = movieCards;
    
    //select movie cards , add click event listeners
    const movieCardsElements = document.querySelectorAll(".movie-card");

    movieCardsElements.forEach(function (card) {
        card.addEventListener("click", function () {
            const imdbID = card.dataset.id;
            getMovieDetails(imdbID);
        });
    });
}


// Search Movies
async function getMovie() {
    // Get the movie title from the input field
    const movieTitle = searchInput.value.trim();

    currentSearch = movieTitle;

    // Check if the input is empty
    if (movieTitle === "") {
        results.innerHTML = `
            <p class="text-center text-red-600 font-semibold text-xl">
                Please enter a movie title.
            </p>
        `;
        return;
    }

    // Show a loading message while fetching data
    results.innerHTML = `
        <p class="text-center text-xl font-semibold animate-pulse">
            🔍 Searching movies...
        </p>
    `;

    
    try {
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&s=${movieTitle}`
        );

    
        if (!response.ok) {
            throw new Error("Failed to fetch movies.");
        }

        const data = await response.json();

        if (data.Response === "False") {

            results.innerHTML = `
                <p class="text-center text-red-600 font-semibold text-xl">
                    ${data.Error}
                </p>
            `;
            return;
        }

        const movies = data.Search;
        const moviesWithPosters = movies.filter(function (movie) {

            return movie.Poster && movie.Poster !== "N/A";

        });
        resultsHeader.classList.add("hidden");
        if (moviesWithPosters.length === 0) {
            results.innerHTML = `
                <p class="text-center text-xl">
                    No movies with posters were found.
                </p>
            `;
            return;
        }

        currentMovies = moviesWithPosters;
        resultsHeader.classList.remove("hidden");
        resultsCount.className = "hidden";

        resultsTitle.textContent = `Results for "${currentSearch}"`;

        resultsCount.textContent = `${currentMovies.length} movies found`;
        resultsCount.className =
            "bg-slate-800 border border-slate-700 mt-4 px-4 py-2 rounded-full text-sm text-slate-300";
            displayMovies(currentMovies);


        searchInput.value = "";

    } catch (error) {

        console.error(error);

        results.innerHTML = `
            <p class="text-center text-red-600 font-semibold text-xl">
                Something went wrong. Please check your internet connection and try again.
            </p>
        `;
    }

}


// Get Movie Details
async function getMovieDetails(imdbID) {
    resultsHeader.classList.add("hidden");
    resultsCount.className = "hidden";
    results.innerHTML = `
        <p class="text-center text-xl font-semibold animate-pulse">
            🎬 Loading movie...
        </p>
    `;

    try {
        
        const response = await fetch(
            `https://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch movie.");
        }

        const data = await response.json();
        results.className = "w-full";
        results.innerHTML = `
            <button
                id="backButton"
                class="mb-8 flex items-center gap-2 bg-slate-800 border border-slate-700 
                hover:border-blue-500 hover:bg-slate-700 px-8 py-3 rounded-xl transition-all duration-300">
                ← Back to Results
            </button>


            <div class="w-full bg-slate-800 rounded-2xl border border-slate-700
                overflow-hidden shadow-xl transition-all duration-300 hover:shadow-blue-900/20">

                <div class="grid grid-cols-1 lg:grid-cols-3">

                    <!-- Poster -->
                    <div class="w-full h-full object-cover lg:rounded-l-2xl">
                        <img
                        src="${data.Poster}"
                        alt="${data.Title}"
                        class="w-full h-full object-cover"
                        onerror="this.src='https://placehold.co/600x900?text=No+Poster'">
                    </div>

                    <!-- Details -->
                    <div class="lg:col-span-2 p-8">
                        <h2 class="text-4xl font-black text-white mb-8">
                            ${data.Title}
                        </h2>


                        <!-- Details -->
                        <div class="lg:col-span-2 p-8">

                            <!-- Quick Info -->
                            <div class="flex flex-wrap items-center gap-3 mb-8">

                                <div class="bg-slate-900 rounded-xl p-4 min-h-[95px] flex flex-col justify-center">
                                    <p class="text-slate-400 text-sm">Year</p>
                                    <p class="text-white font-semibold">${data.Year}</p>
                                </div>

                                <div class="bg-slate-900 rounded-xl p-4 min-h-[95px] flex flex-col justify-center">
                                    <p class="text-slate-400 text-sm">IMDb Rating</p>
                                    <p class="inline-flex w-fit items-center bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-semibold">
                                        ⭐ ${data.imdbRating}
                                    </p>
                                </div>

                                <div class="bg-slate-900 rounded-xl p-4 min-h-[95px] flex flex-col justify-center">
                                    <p class="text-slate-400 text-sm">Genre</p>
                                    <p class="text-white font-semibold">${data.Genre}</p>
                                </div>

                                <div class="bg-slate-900 rounded-xl p-4 min-h-[95px] flex flex-col justify-center">
                                    <p class="text-slate-400 text-sm">Runtime</p>
                                    <p class="text-white font-semibold">${data.Runtime}</p>
                                </div>

                            </div>

                            <!-- Cast -->
                            <div class="mb-8">
                                <h3 class="text-2xl font-bold text-white mb-3">
                                    👥 Cast
                                </h3>

                                <p class="text-slate-300 leading-7 text-lg">
                                    ${data.Actors}
                                </p>
                            </div>

                            <!-- Director -->
                            <div class="mb-8">
                                <h3 class="text-2xl font-bold text-white mb-3">
                                    🎬 Director
                                </h3>

                                <p class="text-slate-300 leading-7 text-lg">
                                    ${data.Director}
                                </p>
                            </div>

                            <!-- Story -->
                            <div>
                                <h3 class="text-2xl font-bold text-white mb-3">
                                    📝 Story
                                </h3>

                                <p class="text-slate-300 leading-8 text-lg">
                                    ${data.Plot}
                                </p>
                            </div>

                        </div>


                        
                    </div>
        
                    
                </div>
            </div>
        `;

        const backButton = document.getElementById("backButton");

            backButton.addEventListener("click", function () {

            results.className ="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8";

            resultsHeader.classList.remove("hidden");
            resultsCount.className = "hidden";

            displayMovies(currentMovies);

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

        } catch (error) {

            console.error(error);

            results.innerHTML = `
                <p class="text-center text-red-600 font-semibold text-xl">
                    Unable to load movie details.
                </p>
            `;
        }
    }


    // Form Submit

    searchForm.addEventListener("submit", function (e) {

        e.preventDefault();

        getMovie();
    });
