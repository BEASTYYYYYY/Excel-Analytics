import fs from 'fs';
import path from 'path';
import process from 'process';
export default function handler(req, res) {
    const historyFile = path.join(process.cwd() || '', 'upload', 'history.json');

    if (req.method === 'GET') {
        if (fs.existsSync(historyFile)) {
            const data = JSON.parse(fs.readFileSync(historyFile));
            res.status(200).json(data);
        } else {
            res.status(200).json([]);
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
