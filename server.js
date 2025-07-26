const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
require('dotenv').config(); // For .env support

const nodemailer = require('nodemailer');
const cron = require('node-cron');

const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mysql@123', // Update to your actual password
  database: 'library_management',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL Database.');
});
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

function sendReminderEmail(toEmail, username, bookTitle, returnDate) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: `Return Reminder: "${bookTitle}" due on ${returnDate}`,
    text: `Hello ${username},\n\nThis is a reminder to return the book "${bookTitle}" by ${returnDate}.\n\nThanks,\nLibrary`
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.error('Email error:', err);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}

// ======= ROUTES ======= //

// Get all books
app.get('/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

app.post('/send-reminder', (req, res) => {
  const { email, username, bookTitle, returnDate } = req.body;

  if (!email || !username || !bookTitle || !returnDate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  sendReminderEmail(email, username, bookTitle, returnDate);
  res.status(200).json({ message: 'Reminder sent.' });
});


// Unified book search by title or author
app.get('/search', (req, res) => {
  const { title, author } = req.query;

  if (!title && !author) {
    return res.status(400).json({ error: 'Title or author is required.' });
  }

  let query = 'SELECT * FROM books WHERE ';
  const params = [];

  if (title) {
    query += 'LOWER(title) LIKE ? ';
    params.push(`%${title.toLowerCase()}%`);
  }

  if (author) {
    if (params.length) query += 'AND ';
    query += 'LOWER(author) LIKE ? ';
    params.push(`%${author.toLowerCase()}%`);
  }

  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(results);
  });
});

// Signup route
app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const query = 'INSERT INTO users (username, password) VALUES (?, ?)';

  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error inserting user:', err.message);
      return res.status(500).json({ error: 'Failed to register user.' });
    }

    res.status(200).json({ success: true, message: 'User registered successfully.' });
  });
});

// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';

  db.query(query, [username, password], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });

    if (results.length > 0) {
      return res.status(200).json({ message: 'Login successful' });
    } else {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
  });
});

// Borrow book
app.post('/borrow', (req, res) => {
  const { name, email, bookTitle, borrowDate, returnDate } = req.body;

  if (!name || !email || !bookTitle || !borrowDate || !returnDate) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const query = 'INSERT INTO borrowing (name, email, book_title, borrow_date, return_date) VALUES (?, ?, ?, ?, ?)';

  db.query(query, [name, email, bookTitle, borrowDate, returnDate], (err, results) => {
    if (err) return res.status(500).json({ error: 'Failed to process borrow request.' });

    res.status(200).json({ success: true, message: 'Book borrowing request submitted successfully.' });
  });
});

// View my borrowed books
app.get('/mybooks', (req, res) => {
  const { username } = req.query;
  if (!username) return res.status(400).json({ error: 'Username is required.' });

  const query = `
    SELECT borrow_id, book_title, borrow_date, return_date
    FROM borrowing WHERE name = ?`;

  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error.' });

    const books = results.map(row => ({
      borrow_id: row.borrow_id,
      title: row.book_title,
      borrowed_on: row.borrow_date,
      return_by: row.return_date,
    }));

    res.json({ books, totalBooks: books.length });
  });
});

// Cancel borrow
app.delete('/mybooks/:borrowId', (req, res) => {
  const { borrowId } = req.params;

  if (!borrowId) {
    return res.status(400).json({ error: 'Borrow ID is required.' });
  }

  const checkQuery = 'SELECT * FROM borrowing WHERE borrow_id = ?';
  db.query(checkQuery, [borrowId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error.' });

    if (results.length === 0) {
      return res.status(404).json({ error: 'Borrow ID not found.' });
    }

    const deleteQuery = 'DELETE FROM borrowing WHERE borrow_id = ?';
    db.query(deleteQuery, [borrowId], (err, result) => {
      if (err) return res.status(500).json({ error: 'Failed to delete borrow record.' });

      res.json({ message: 'Borrow record successfully deleted.' });
    });
  });
});

// Get authors
app.get('/authors', (req, res) => {
  const query = 'SELECT name, description FROM authors';

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'Internal server error' });
    res.json(results);
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
