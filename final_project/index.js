import express from "express";
import session from "express-session";
import publicUsers from "./router/general.js";
import registeredUsers from "./router/auth_users.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "book-review-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 1000 }
  })
);

app.use("/customer", registeredUsers);
app.use("/", publicUsers);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).json({ message: "Internal server error" });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Book Review server running at http://localhost:${PORT}`);
  });
}

export default app;
