const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


const isValid = (username) => {
    //returns boolean
    //write code to check is the username is valid
    return username && username.length > 0 && users.some(data => data.username === username);
}

const authenticatedUser = (username, password) => {
    //returns boolean
    //write code to check if username and password match the one we have in records.
    return users.find(data => data.username === username && data.password === password);
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    //Write your code here

    try {
        const { username, password } = req.body
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password are required" });
        }
        if (!authenticatedUser(username, password)) {
            return res.status(401).json({ message: "Invalid username or password" });
        }
        
        const token = jwt.sign({ username }, "secret_key", { expiresIn: "1h" });
        req.session.authorization = { accessToken: token };
        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Error logging in", error: error.message });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    try {
        const isbn = req.params.isbn;
        const review = req.query.review; 
        const username = req.user.username;  
        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }
        if (!review) {
            return res.status(400).json({ message: "Review is required" });
        }
        
        if (!books[isbn].reviews) {
            books[isbn].reviews = {};  // Create an empty reviews object if it doesn't exist
        }

        books[isbn].reviews[username] = review; 
        return res.status(200).json({
            message: "Review added/updated successfully",
            reviews: books[isbn].reviews
        });
    } catch (error) {
        return res.status(500).json({ message: "Error adding review", error: error.message });
    }
});

//Delete reviews
regd_users.delete("/auth/review/:isbn", (req, res) => {
    try {
        const isbn = req.params.isbn;
        const username = req.user.username; 
    
        if (!books[isbn]) {
            return res.status(404).json({ message: "No book found" });
        }
  
        if (!books[isbn].reviews[username]) {
            return res.status(404).json({ message: "No review found for this user on this book" });
        }
  
        delete books[isbn].reviews[username];
        return res.status(200).json({
            message: "Review deleted successfully",
            reviews: books[isbn].reviews
        });
    } catch (error) {
        return res.status(500).json({ message: "Error in deleting review", error: error.message });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
