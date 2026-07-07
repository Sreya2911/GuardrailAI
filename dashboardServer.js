import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "dashboard")));

app.get("/api/logs", (req, res) => {

    const logPath = path.join(__dirname, "logs", "audit-log.json");

    try {

        if (!fs.existsSync(logPath)) {
            return res.json([]);
        }

        const logs = JSON.parse(
            fs.readFileSync(logPath, "utf8") || "[]"
        );

        res.json(logs);

    } catch (err) {

        res.status(500).json({
            error: err.message
        });

    }

});

app.get("/", (req, res) => {

    res.sendFile(
        path.join(__dirname, "dashboard", "index.html")
    );

});

app.listen(PORT, () => {

    console.log(
        `🚀 Compliance Dashboard running at http://localhost:${PORT}`
    );

});