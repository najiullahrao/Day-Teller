import express from "express";
import ejs from "ejs";

const app = express();
const port = 3000;


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});