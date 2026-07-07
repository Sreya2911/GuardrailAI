import fs from "fs";
import path from "path";
import { publishEvent } from "../api/events.js";

const LOG_PATH = path.resolve("logs/audit-log.json");

export function logAudit(entry) {

    try {

        let logs = [];

        if (fs.existsSync(LOG_PATH)) {
            const data = fs.readFileSync(LOG_PATH, "utf8");

            if (data.trim()) {
                logs = JSON.parse(data);
            }
        }

        const log = {
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
            ...entry
        };

        logs.unshift(log);

        fs.writeFileSync(
            LOG_PATH,
            JSON.stringify(logs, null, 2)
        );

        publishEvent(log);

    } catch (err) {
        console.error(err);
    }

}