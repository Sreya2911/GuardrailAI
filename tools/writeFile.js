import fs from "fs";
import path from "path";

export function writeFile(filePath, content) {
    try {
        const fullPath = path.resolve(filePath);

        fs.mkdirSync(path.dirname(fullPath), {
            recursive: true
        });

        fs.writeFileSync(fullPath, content, "utf8");

        return {
            success: true,
            path: fullPath,
            message: "File written successfully."
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}