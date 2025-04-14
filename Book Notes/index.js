import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import methodOverride from "method-override";

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Booknotes",
    password: "291536",
    port: 5432,
});
db.connect();

const app = express();
const port = 3000;

// Middleware
app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Set EJS as view engine
app.set("view engine", "ejs");

// ✅ Route: Home - List all books
app.get("/", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM books ORDER BY rating DESC");
        res.render("index.ejs", { books: result.rows });
    } catch (error) {
        console.error("Error fetching books:", error);
        res.status(500).send("Server Error");
    }
});

// ✅ Route: Show Add Book Form
app.get("/add", (req, res) => {
    res.render("add.ejs");
});

// ✅ Route: Handle Add Book Submission
app.post("/add", async (req, res) => {
    const { title, author, rating, notes, date_read } = req.body;

    try {
        await db.query(
            "INSERT INTO books (title, author, rating, notes, date_read) VALUES ($1, $2, $3, $4, $5)",
            [title, author, rating, notes, date_read]
        );
        res.redirect("/");
    } catch (error) {
        console.error("Error adding book:", error);
        res.status(500).send("Server Error");
    }
});

// ✅ Route: Show Edit Form
app.get("/edit/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const result = await db.query("SELECT * FROM books WHERE id = $1", [id]);

        if (result.rows.length === 0) {
            return res.status(404).send("Book not found");
        }

        res.render("edit.ejs", { book: result.rows[0] }); // Ensure `book` is an object
    } catch (error) {
        console.error("Error fetching book:", error);
        res.status(500).send("Server Error");
    }
});

// ✅ Route: Handle Edit (Update) Request
app.put("/edit/:id", async (req, res) => {
    const { id } = req.params;
    const { title, author, rating, notes, date_read } = req.body;

    try {
        await db.query(
            "UPDATE books SET title = $1, author = $2, rating = $3, notes = $4, date_read = $5 WHERE id = $6",
            [title, author, rating, notes, date_read, id]
        );
        res.redirect("/");
    } catch (error) {
        console.error("Error updating book:", error);
        res.status(500).send("Server Error");
    }
});

// ✅ Route: Delete a Book
app.post("/delete/:id", async (req, res) => {
    const { id } = req.params;

    try {
        await db.query("DELETE FROM books WHERE id = $1", [id]);
        res.redirect("/");
    } catch (error) {
        console.error("Error deleting book:", error);
        res.status(500).send("Server Error");
    }
});

// ✅ Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
