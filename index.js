import express from "express";
import {Pool} from "pg";
import dotenv from "dotenv";

const env = process.env.NODE_ENV || "dev";
dotenv.config({path: `.env.${env}`});

const app = express();
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
    res.send(`This app is running in ${env} mode`);
})

app.get("/students", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM students");
        res.json(result.rows);

    } catch (err) {
        res.status(500).send(err.message);
    }
});


app.post("/students", async (req, res) => {
    const {name, age} = req.body;
    try {
        const result = await pool.query("INSERT INTO students (name, age) VALUES ($1, $2) RETURNING *", [name, age]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.put("/students/:id", async (req, res) => {
    const id = req.params.id;
    const {name, age} = req.body;
    try {
        const result = await pool.query("UPDATE students SET name = $1, age = $2 WHERE id = $3 RETURNING *", [name, age, id]);
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }

});

app.delete("/students/:id", async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query("DELETE FROM students WHERE id = $1 RETURNING *", [id]);
        if (result.rows.lenght === 0) {
            res.status(404).send("Student not found");

        }
        res.json(result.rows[0]);
        } catch (err) {
            res.status(500).send(err.message);
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});