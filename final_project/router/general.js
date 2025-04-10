const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    try {

        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required"
            });
        }
        if(username && password){
            if(!isValid(username)){
              users.push({'username':username, 'password': password});
              return res.status(201).json({message:'User Registered successfully. Now you can login.'})
            }
            else{
                return res.status(409).json({message:'User already exists'})
              }
        }
    } catch (error) {
        res.status(404).json({
            message:'Unable register the user',
            error:error.message
        });
    }
});

// Task-10
// Get the book list available in the shop using async/await
public_users.get('/' , async (req,res) => {
    try {
      const allBooks = await new Promise((resolve,reject)=>{
        if(books){
          resolve(books);
        } else{
          reject(new Error('Books not available'));
        }
      });
      return res.status(200).json(allBooks);
    } catch (error) {
      res.status(500).json({message:'Error retrieving books', error: error.message});
    }
  });

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    //Write your code here
    return res.send(JSON.stringify(books, null, 4));
});

// Task-11
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req,res) => {
    const isbn = req.params.isbn;
  
    new Promise((resolve,reject) => {
      const book = books[isbn];
      if(book){
        resolve(book);
      } else {
        reject('Book not found');
      }
    })
    .then((book) => {
      res.status(200).json(book)
    })
    .catch((error)=>{
      res.status(404).json({message:error})
    })
  
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const data = req.params.isbn;
    // Sends the found book as a JSON response
    if (books[data]) {
        res.send(books[data]);
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }

});

// Task 12
// Get book details based on author
public_users.get('/author/:author', function(req,res) {
    const author = req.params.author;
  
    new Promise((resolve,reject) => {
      const isMatch = Object.values(books).filter(book => book.author === author);
      if(isMatch.length > 0){
        resolve(isMatch)
      } else {
        reject('Book not found for the author')
      }
    })
    .then((isMatch)=>{
      res.status(200).json(isMatch);
    })
    .catch((error)=>{
      res.status(404).json({message:error});
    })
  });

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    //Write your code here
    const author = req.params.author
    //console.log(author)

    const results = [];

    for (let key in books) {
        if (books[key].author === author) {
            results.push(books[key]);
        }
    }

    if (results.length > 0) {
        res.json(results);
    } else {
        res.status(404).json({ message: "Book not found" });
    }
});

// Task 13
// Get all books based on title
public_users.get('/title/:title', function(req,res){
    const title = req.params.title;
  
    new Promise((resolve,reject) => {
      const istitle = Object.values(books).filter(book => book.title === title);
      if(istitle.length > 0){
        resolve(istitle);
      } else{
        reject('Book not found for the title');
      }
    })
    .then((istitle)=>{
      return res.status(200).json(istitle);
    })
    .catch((error)=>{
      return res.status(404).json({message:error});
    })
  });


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    //Write your code here
    const b_title = req.params.title
    const title_results = [];

    for (let key in books) {
        if (books[key].title === b_title) {
            title_results.push(books[key]);
        }
    }

    if (title_results.length > 0) {
        res.json(title_results);
    } else {
        res.status(400).json({ message: "Book not found" });
    }


});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn_rev = req.params.isbn
    //console.log(isbn_rev)

    if (books[isbn_rev]) {
        return res.send(JSON.stringify(books[isbn_rev].reviews, null, 4));
    } else {
        return res.status(404).json({ message: 'Book not found' });
    }

});

module.exports.general = public_users;
