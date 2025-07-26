document.addEventListener('DOMContentLoaded', function () {
    // Fetch all authors from the Node.js server on page load
    fetchAuthors();

    // Search authors on input change
    document.getElementById('authorSearch').addEventListener('input', function () {
        searchAuthor(this.value);
    });
});

// Function to fetch authors from the backend
function fetchAuthors() {
    fetch('http://localhost:3000/authors')
        .then(response => response.json())
        .then(data => {
            displayAuthors(data); // Pass authors to display function
        })
        .catch(err => console.error('Error fetching authors:', err));
}

// Function to display authors
function displayAuthors(authors) {
    const authorsList = document.getElementById('authors-list');
    authorsList.innerHTML = ''; // Clear existing authors

    authors.forEach(author => {
        const authorCard = document.createElement('div');
        authorCard.classList.add('author-card');
        
        const authorInfo = document.createElement('div');
        authorInfo.classList.add('author-info');

        const authorName = document.createElement('h3');
        authorName.textContent = author.name;

        const authorDescription = document.createElement('p');
        authorDescription.textContent = author.description;

        authorInfo.appendChild(authorName);
        authorInfo.appendChild(authorDescription);
        authorCard.appendChild(authorInfo);
        authorsList.appendChild(authorCard);
    });
}

}

// Function to search for authors by name
function searchAuthor(searchQuery) {
    const authors = document.querySelectorAll('.author-card');
    
    authors.forEach(author => {
        const name = author.querySelector('h3').textContent.toLowerCase();
        if (name.includes(searchQuery.toLowerCase())) {
            author.style.display = 'block';
        } else {
            author.style.display = 'none';
        }
    });
}
