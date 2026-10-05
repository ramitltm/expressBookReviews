import express from "express";
import jwt from "jsonwebtoken";
import books from "./booksdb.js";
import { authenticatedUser } from "./general.js";

const registeredUsers = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "book-review-development-secret";

// Task 7: Login as a registered user.
registeredUsers.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }
  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const accessToken = jwt.sign({ username }, JWT_SECRET, { expiresIn: "1h" });
  req.session.authorization = { accessToken, username };
  return res.status(200).json({
    message: "Customer successfully logged in",
    accessToken
  });
});

registeredUsers.use("/auth", (req, res, next) => {
  const token =
    req.session.authorization?.accessToken ||
    req.headers.authorization?.replace(/^Bearer\s+/i, "");

  if (!token) return res.status(401).json({ message: "Login required" });

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Task 8: Add or modify a review.
registeredUsers.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review ?? req.body.review;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!review?.trim()) {
    return res.status(400).json({ message: "Review text is required" });
  }

  books[isbn].reviews[req.user.username] = review.trim();
  return res.status(200).json({
    message: "Book review added or modified successfully",
    reviews: books[isbn].reviews
  });
});

// Task 9: Delete the logged-in user's review.
registeredUsers.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  if (!books[isbn]) return res.status(404).json({ message: "Book not found" });
  if (!(req.user.username in books[isbn].reviews)) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete books[isbn].reviews[req.user.username];
  return res.status(200).json({
    message: "Book review deleted successfully",
    reviews: books[isbn].reviews
  });
});

export default registeredUsers;
