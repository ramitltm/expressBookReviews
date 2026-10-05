import express from "express";
import books from "./booksdb.js";

const publicUsers = express.Router();
export const users = [];

const normalize = (value) => decodeURIComponent(value).trim().toLowerCase();

export function isValid(username) {
  return users.some((user) => user.username === username);
}

export function authenticatedUser(username, password) {
  return users.some(
    (user) => user.username === username && user.password === password
  );
}

// Task 1: Get all books.
publicUsers.get("/", (req, res) => {
  return res.status(200).json(books);
});

// Task 2: Get a book by ISBN.
publicUsers.get("/isbn/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book);
});

// Task 3: Get books by author. Partial and case-insensitive matching.
publicUsers.get("/author/:author", (req, res) => {
  const author = normalize(req.params.author);
  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) =>
      book.author.toLowerCase().includes(author)
    )
  );
  if (Object.keys(matches).length === 0) {
    return res.status(404).json({ message: "No books found for this author" });
  }
  return res.status(200).json(matches);
});

// Task 4: Get books by title. Partial and case-insensitive matching.
publicUsers.get("/title/:title", (req, res) => {
  const title = normalize(req.params.title);
  const matches = Object.fromEntries(
    Object.entries(books).filter(([, book]) =>
      book.title.toLowerCase().includes(title)
    )
  );
  if (Object.keys(matches).length === 0) {
    return res.status(404).json({ message: "No books found with this title" });
  }
  return res.status(200).json(matches);
});

// Task 5: Get reviews for a book.
publicUsers.get("/review/:isbn", (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

// Task 6: Register a new user.
publicUsers.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(201).json({
    message: "User successfully registered. Now you can login"
  });
});

export default publicUsers;
