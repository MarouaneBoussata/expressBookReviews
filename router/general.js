const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  // Check if username or password is missing
  if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
  }

  // Check if username already exists
  if (users.some(user => user.username === username)) {
      return res.status(400).json({ message: 'Username already exists' });
  }

  // Store user data (replace with database storage)
  users.push({ username, password });

  res.status(201).json({ message: 'User registered successfully' });
});


public_users.get('/', (req, res) => {
  const getBooks = () => {
    return new Promise((resolve, reject) => {
      // Assuming the endpoint to fetch books is '/api/books'
      axios.get(books)
        .then(response => {
          resolve(response.data); // Resolve with the fetched data
        })
        .catch(error => {
          reject(error); // Reject with the error
        });
    });
  };

  // Call the getBooks function
  getBooks()
    .then(books => {
      res.status(200).json(books); // Send books data as JSON response
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      res.status(500).json({ message: 'Error fetching books.' });
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  let isbn = req.params.isbn;
  let filtered_books = books[isbn+1]
  if (filtered_books) {
    res.json(filtered_books); // Automatically sets the correct headers and stringifies the JSON
} else {
    res.status(404).json({ message: "Book not found" });
}
 });

 
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
    // Get array of books from books object
    const allBooks = Object.values(books);
    // Filter books by author
    const filteredBooks = allBooks.filter(book => book.author === author);
    if (filteredBooks.length > 0) {
        res.status(200).json(filteredBooks);
    } else {
        res.status(404).json({ message: "No books found for the author" });
    }
});


// public_users.get('/author/:author',async (req, res) => {


//   //using promises
//   const author = req.params.author;
//   const booksBasedOnAuthor = (auth) => {
//         return new Promise((resolve,reject) =>{
//           setTimeout(() =>{
//             const filteredbooks = books.filter((b) => b.author === auth);
//             if(filteredbooks>0){
//               resolve(filteredbooks);
//             }else{
//               reject(new Error("Book not found"));
//             }},1000);
//         });
    
            
//     }
//     booksBasedOnAuthor(author).then((book) =>{
//       res.json(book);
//     }).catch((err)=>{
//       res.status(400).json({error:"Book not found"})
//     });


public_users.get('/title/:title',async (req, res) => {
  


  const title = req.params.title;
  const booksBasedOnTitle = (booktitle) => {
        return new Promise((resolve,reject) =>{
          setTimeout(() =>{
            const filteredbooks = books.filter((b) => b.title === booktitle);
            if(filteredbooks>0){
              resolve(filteredbooks);
            }else{
              reject(new Error("Book not found"));
            }},1000);
        });
    
            
    }
    booksBasedOnTitle(title).then((new_books) =>{
      res.json(new_books);
    }).catch((err)=>{
      res.status(400).json({error:"Book not found"})
    });

  
  
});

// Get all books based on title
// public_users.get('/title/:title',function (req, res) {
//   const title = req.params.title;
//   const allBooks =Object.values(books);
//   let filered_books= allBooks.filter(book => book.title===title);
//   if(filered_books.length>0){res.send(JSON.stringify(filered_books));}
//   else{res.send("No books found");}
// });

//  Get book review

public_users.get('/review/:isbn', function (req, res) {
  const allBooks = Object.values(books);
  const isbn = req.params.isbn;

  // Find the book by ISBN
  const book = allBooks.find(book => book.isbn === isbn);

  if (book) {
      const reviews = book.reviews;
      res.status(200).send(JSON.stringify(reviews, null, 4));
  } else {
      res.status(404).send("No book found for the ISBN");
  }
});

module.exports.general = public_users;
