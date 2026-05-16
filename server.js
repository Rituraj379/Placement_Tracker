const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Read data
app.get('/api/data', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            // If file doesn't exist, return empty object
            if (err.code === 'ENOENT') {
                return res.json({});
            }
            console.error('Error reading data:', err);
            return res.status(500).json({ error: 'Failed to read data' });
        }
        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            console.error('Error parsing data:', parseErr);
            res.status(500).json({ error: 'Failed to parse data' });
        }
    });
});

// Write data
app.post('/api/data', (req, res) => {
    const data = req.body;
    fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing data:', err);
            return res.status(500).json({ error: 'Failed to write data' });
        }
        res.json({ success: true });
    });
});

app.listen(PORT, () => {
    console.lang = 'en';
    console.log(`Server is running on http://localhost:${PORT}`);
});
