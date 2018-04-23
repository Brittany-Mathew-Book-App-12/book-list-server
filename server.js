'use strict';
require('dotenv').config();

// Application dependencies
const express = require('express');
const cors = require('cors');
const pg = require('pg');
// const DATABASE_URL = process.env.DATABASE_URL;


// Application Setup
const app = express();
const PORT = process.env.PORT || 3000; //delete on saturday
const CLIENT_URL = process.env.CLIENT_URL;

// Database Setup
const client = new pg.Client(process.env.DATABASE_URL); //|| 'postgres://localhost/books_app');
client.connect();
client.on('error', err => console.error(err));

const apiUrl = '/api/v1/books';

// Application Middleware
app.use(cors());
app.use(express.urlencoded({extended:true}));
app.use(express.json());


// API Endpoints
app.get(apiUrl, (req, res) => {
  client.query(`
  SELECT book_id, title, author, image_url, isbn FROM books;`)
    .then(results => res.send(results.rows)
      .catch(console.error));
});

app.get(apiUrl + '/:id', (req, res) => {
  client.query(`
  
  SELECT * FROM books WHERE book_id=$1

`, [req.params.id])
    .then(results => res.send(results.rows))
    // .catch(err => res.sendStatus(500));
    .catch(console.error);
});

app.post(apiUrl, (req, res) => {
  client.query(`
  
  INSERT INTO books
  (title, author, isbn, image_url, description)
  VALUES ($1, $2, $3, $4, $5);

`, [req.body.title,
      req.body.author,
      req.body.isbn,
      req.body.image_url,
      req.body.description])
    .then(results => res.send(results.rows))
    .catch(console.error);
});

app.get('*', (req, res) => res.redirect(CLIENT_URL));
app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));
