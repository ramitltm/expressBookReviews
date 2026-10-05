import axios from "axios";

const api = axios.create({ baseURL: process.env.API_URL || "http://localhost:5000" });

// Task 10: Get all books using async/await.
export async function getAllBooks() {
  const { data } = await api.get("/");
  return data;
}

// Task 11: Search by ISBN using a Promise callback.
export function getBookByISBN(isbn) {
  return api.get(`/isbn/${encodeURIComponent(isbn)}`).then(({ data }) => data);
}

// Task 12: Search by author using async/await.
export async function getBooksByAuthor(author) {
  const { data } = await api.get(`/author/${encodeURIComponent(author)}`);
  return data;
}

// Task 13: Search by title using a Promise callback.
export function getBooksByTitle(title) {
  return api.get(`/title/${encodeURIComponent(title)}`).then(({ data }) => data);
}

async function runDemo() {
  try {
    console.log("All books:", await getAllBooks());
    console.log("ISBN 1:", await getBookByISBN("1"));
    console.log("Author Austen:", await getBooksByAuthor("Austen"));
    console.log("Title Pride:", await getBooksByTitle("Pride"));
  } catch (error) {
    console.error("Axios request failed:", error.response?.data ?? error.message);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo();
}
