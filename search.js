const books = [
    { title: "The Great Gatsby", author: "F. Scott Fitzgerald", publisher: "Scribner", rating: "4.3/5" },
    { title: "1984", author: "George Orwell", publisher: "Secker & Warburg", rating: "4.7/5" },
    { title: "To Kill a Mockingbird", author: "Harper Lee", publisher: "J.B. Lippincott & Co.", rating: "4.8/5" },
    { title: "Moby-Dick", author: "Herman Melville", publisher: "Harper & Brothers", rating: "4.2/5" },
    { title: "War and Peace", author: "Leo Tolstoy", publisher: "The Russian Messenger", rating: "4.4/5" },
    { title: "Pride and Prejudice", author: "Jane Austen", publisher: "T. Egerton", rating: "4.5/5" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", publisher: "Little, Brown and Company", rating: "4.1/5" },
    { title: "The Hobbit", author: "J.R.R. Tolkien", publisher: "George Allen & Unwin", rating: "4.6/5" },
    { title: "Brave New World", author: "Aldous Huxley", publisher: "Chatto & Windus", rating: "4.4/5" },
    { title: "Crime and Punishment", author: "Fyodor Dostoevsky", publisher: "The Russian Messenger", rating: "4.6/5" },
    { title: "Jane Eyre", author: "Charlotte Brontë", publisher: "Smith, Elder & Co.", rating: "4.7/5" },
    { title: "The Odyssey", author: "Homer", publisher: "Various", rating: "4.3/5" },
    { title: "The Picture of Dorian Gray", author: "Oscar Wilde", publisher: "Lippincott's Monthly Magazine", rating: "4.4/5" },
    { title: "The Divine Comedy", author: "Dante Alighieri", publisher: "Various", rating: "4.7/5" },
    { title: "Frankenstein", author: "Mary Shelley", publisher: "Lackington, Hughes, Harding, Mavor & Jones", rating: "4.3/5" },
    { title: "The Catcher in the Rye", author: "J.D. Salinger", publisher: "Little, Brown and Company", rating: "4.2/5" },
    { title: "Animal Farm", author: "George Orwell", publisher: "Secker & Warburg", rating: "4.5/5" },
    { title: "The Lord of the Rings", author: "J.R.R. Tolkien", publisher: "George Allen & Unwin", rating: "4.8/5" },
    { title: "Don Quixote", author: "Miguel de Cervantes", publisher: "Francisco de Robles", rating: "4.6/5" },
    { title: "The Brothers Karamazov", author: "Fyodor Dostoevsky", publisher: "The Russian Messenger", rating: "4.5/5" }
  ];
  
  fdocument.querySelector('.search-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const title = document.getElementById('searchTitle').value;
    const author = document.getElementById('searchAuthor').value;
  
    fetch(`http://localhost:3000/search-books?title=${title}&author=${author}`)
      .then(response => response.json())
      .then(data => {
        console.log('Search results:', data);
        // Handle display of search results (create elements dynamically)
      })
      .catch(err => console.error('Error searching books:', err));
  });
  
  
  // Initially display all books
  