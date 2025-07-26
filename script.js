// Sample book data
const books = [
    { id: '101', title: 'JavaScript Basics', author: 'John Doe', status: 'Available' },
    { id: '102', title: 'HTML & CSS Design', author: 'Jane Smith', status: 'Issued' },
    { id: '103', title: 'Python Programming', author: 'Alan Turing', status: 'Available' },
    { id: '104', title: 'Data Structures', author: 'Grace Hopper', status: 'Available' }
  ];
  
  // Function to display books
  function displayBooks() {
    const bookTable = document.getElementById('bookTable');
    bookTable.innerHTML = '';
  
    books.forEach(book => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${book.id}</td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.status}</td>
        <td>
          <button onclick="issueBook('${book.id}')" ${book.status === 'Issued' ? 'disabled' : ''}>Issue</button>
        </td>
      `;
      bookTable.appendChild(row);
    });
  }
  
  // Search books
  function searchBooks() {
    const query = document.getElementById('search').value.toLowerCase();
    const bookTable = document.getElementById('bookTable');
    bookTable.innerHTML = '';
  
    books
      .filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query))
      .forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${book.id}</td>
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.status}</td>
          <td>
            <button onclick="issueBook('${book.id}')" ${book.status === 'Issued' ? 'disabled' : ''}>Issue</button>
          </td>
        `;
        bookTable.appendChild(row);
      });
  }
  
  // Issue book
  function issueBook(bookID) {
    const borrowerName = document.getElementById('borrowerName').value;
    const borrowerID = document.getElementById('borrowerID').value;
  
    if (!borrowerName || !borrowerID) {
      alert('Please enter borrower details.');
      return;
    }
  
    const book = books.find(b => b.id === bookID);
  
    if (book && book.status === 'Available') {
      book.status = 'Issued';
      alert(`Book "${book.title}" has been issued to ${borrowerName} (ID: ${borrowerID}).`);
      displayBooks();
    } else {
      alert('This book is already issued.');
    }
  }
  function signOut() {
    alert("You have been signed out.");
    window.location.href = "login.html";
  }
  
  // Function to handle sign-out (you can add more logic if needed)
  function signOut() {
    // Clear sessionStorage or localStorage if you're using them
    sessionStorage.clear(); // Adjust based on your needs
    localStorage.clear();   // If you're using localStorage for login sessions
    
    // Show notification (simple alert)
    alert('You have been signed out successfully!');
    window.location.href = "login.html";
    // Redirect user to the homepage (or a specific page)
  }
  
  // Load books on page load
  window.onload = displayBooks;
  