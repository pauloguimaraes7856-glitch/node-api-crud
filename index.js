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



app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});