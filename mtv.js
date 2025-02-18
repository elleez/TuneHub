// store the search term entered by the user
let term = '';
// Array to keep track of all audio elements for playback
let audioElements = [];


/*** Fetches songs from the iTunes API based on the user's search term.*/
const updateTerm = () => {
    // Get and trim the search form the input field
    term = document.getElementById('searchTerm').value.trim();

    // Alert the user if the input field id empty
    if (!term) {        alert('Please enter a search term');
        return;
    }
      // Construct the API request URL
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&media=music&limit=10`;

      // Fetch data from the iTunes API
    fetch(url)
        .then(response => response.json()) // Convert response to JSON
        .then(data => {
            const artists = data.results; // Extract the List of Songs
            const songContainer = document.getElementById('songs');
            songContainer.innerHTML = ''; // Clear previous results
            audioElements = []; // Reset the audio elemenets array

            // If no results are found, display a message and disable the "Play All" buttom
            if (artists.length === 0) {
                songContainer.innerHTML = '<p>No results found.</p>';
                document.getElementById('playAllBtn').disabled = true;
                return;
            }

            //Loop through the search results and create elements for each song

            artists.forEach((result, index) => {
                const article = document.createElement('article');
                article.style.border = '1px solid #ccc';
                article.style.padding = '10px';
                article.style.margin = '10px 0';

            // Create elements to display song details
                const artistName = document.createElement('p');
                const songName = document.createElement('h4');
                const img = document.createElement('img');
                const audio = document.createElement('audio');
                const audioSource = document.createElement('source');
            
            // Set the content for each elements
                artistName.textContent = `Artist: ${result.artistName}`;
                songName.textContent = `Song: ${result.trackName}`;
                img.src = result.artworkUrl100;
                img.alt = `Album artwork for ${result.trackName}`;
                img.style.width = '100px';
                img.style.height = '100px';

            // Set up the audio preview
                audioSource.src = result.previewUrl;
                audio.controls = true;
                audio.appendChild(audioSource);
                audioElements.push(audio); // Add audio to the List

                // Append all elements to the article
                article.appendChild(img);
                article.appendChild(artistName);
                article.appendChild(songName);
                article.appendChild(audio);
                songContainer.appendChild(article);
            });

            // Enable the "Play all" button if songs are found
            document.getElementById('playAllBtn').disabled = audioElements.length === 0;
        })
        .catch(error => {
            console.error('Request failed:', error);
            alert('An error occurred while fetching the songs.');
        });
};

/*** Plays all the fetched songs sequentially.*/

const playAllSongs = () => {
    if (audioElements.length === 0) return;
    let currentIndex = 0;

    
    /** * Plays the next song in the playlist.*/

    const playNext = () => {
        if (currentIndex < audioElements.length) {
            const currentAudio = audioElements[currentIndex];
            currentAudio.play();
            currentAudio.addEventListener('ended', () => {
                currentIndex++;
                playNext();
            }, { once: true }); // Ensure event fires only once per song
        }
    };

    playNext();
};

// Attach event listeners for search and "Play All" button functionality
document.getElementById('searchTermBtn').addEventListener('click', updateTerm);
document.getElementById('playAllBtn').addEventListener('click', playAllSongs);

// mtv.js (or newtune.js)

// Function to dynamically load a stylesheet
function loadStyleSheet(href, id) {
    if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = href;
        link.id = id;
        document.head.appendChild(link);
    }
}

// Apply the correct stylesheet for the current page
function applyPageSpecificStyles() {
    const currentPage = window.location.pathname.split('/').pop();
    let stylesheet = currentPage === 'mtv.html' ? 'mtv.css' : 'newtune.css';
    if (stylesheet) {
        loadStyleSheet(stylesheet, `${currentPage}-stylesheet`);
    }
}

// Apply the styles on page load
applyPageSpecificStyles();

// Logout button functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
        localStorage.removeItem('user'); // Remove user session data
        window.location.href = 'newtune.html'; // Redirect to login page
    });
}

  

