const XLSX = require('xlsx');
const path = require('path');

exports.processExcelFile = (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        const workbook = XLSX.readFile(req.file.path);
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(sheet);

        if (!jsonData.length) return res.status(400).json({ error: 'Excel file is empty' });

        // Prepare data for bar chart (assume 2 columns for simplicity)
        const keys = Object.keys(jsonData[0]);
        const labels = jsonData.map(row => row[keys[0]]);
        const values = jsonData.map(row => row[keys[1]]);

        return res.json({
            labels,
            values,
            xKey: keys[0],
            yKey: keys[1],
        });
    } catch (err) {
        return res.status(500).json({ error: 'Error processing file', details: err.message });
    }
};
