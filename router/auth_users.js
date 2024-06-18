const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records

const findUser = users.filter(user=>user.username===username && user.password===password);
if(findUser.length>0) {return true;}
else{return false;}
}



//only registered users can login
regd_users.post("/login", (req,res) => {
  const username=req.body.username
  const password=req.body.password
  if (!username || !password) {
    return res.status(404).json({message: "Error logging in"});
}
if (authenticatedUser(username,password)) {
  let accessToken = jwt.sign({
    data: password
  }, 'access', { expiresIn: 60 * 60 });
  req.session.authorization = {
    accessToken,username
}
return res.status(200).send("User successfully logged in");
} else {
  return res.status(208).json({message: "Invalid Login. Check username and password"});
}
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let userd = req.session.username;
  let ISBN = req.params.isbn;
  let details = req.query.review;
  let reviewText = {user:userd,review:details}
  books[ISBN].reviews = reviewText;
  return res.status(201).json({message:"Review added successfully"})

});
regd_users.delete("/auth/review/:isbn",(req, res) => {
  const username = req.session.username;
  const isbn = req.params.isbn;
   const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }
  delete book.reviews[username];

  // Send success response
  return res.status(200).json({ message: "Review deleted successfully." });

})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
