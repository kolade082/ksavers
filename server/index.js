const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const pdfParse = require('pdf-parse');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: '*', // Allow all origins in development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true
}));

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'PDF Parser Server is running'
    });
});

// PDF parsing endpoint
app.post('/pdf-parse', async (req, res) => {
    try {
        console.log('Received PDF parsing request');
        const {
            pdfData
        } = req.body;

        if (!pdfData) {
            throw new Error('No PDF data provided');
        }

        // Convert base64 to buffer
        const buffer = Buffer.from(pdfData, 'base64');
        console.log('PDF buffer size:', buffer.length);

        // Parse PDF
        const data = await pdfParse(buffer);
        console.log('PDF parsed successfully');
        console.log('Number of pages:', data.numpages);
        console.log('First 500 characters of text:', data.text.substring(0, 500));

        // Extract transactions from the text
        const transactions = extractTransactions(data.text);
        console.log(`Found ${transactions.length} transactions`);

        if (transactions.length === 0) {
            console.log('No transactions found. Full text:', data.text);
        }

        res.json({
            transactions
        });
    } catch (error) {
        console.error('Error parsing PDF:', error);
        res.status(500).json({
            error: 'Failed to parse PDF'
        });
    }
});

function extractTransactions(text) {
    const transactions = [];
    const lines = text.split('\n');

    console.log('Processing lines:', lines.length);

    // Chase statement patterns
    const patterns = [
        // Opening balance pattern
        /(\d{1,2}\s+[A-Za-z]+\s+\d{4})Opening balance(£[\d,]+\.?\d*)/,
        // Interest pattern
        /(\d{1,2}\s+[A-Za-z]+\s+\d{4})Interest earned\s+Interest\s+([+-]£[\d,]+\.?\d*)/,
        // Transfer pattern
        /(\d{1,2}\s+[A-Za-z]+\s+\d{4})To Kolade's Account\s+Transfer\s+([+-]£[\d,]+\.?\d*)/,
        // Closing balance pattern
        /(\d{1,2}\s+[A-Za-z]+\s+\d{4})Closing balance(£[\d,]+\.?\d*)/
    ];

    for (const line of lines) {
        // Skip empty lines and headers
        if (!line.trim() || line.toLowerCase().includes('date') || line.toLowerCase().includes('transaction details')) {
            continue;
        }

        for (const pattern of patterns) {
            const match = line.match(pattern);
            if (match) {
                const [_, dateStr, amountStr] = match;

                // Parse date (e.g., "01 Nov 2024")
                const [day, month, year] = dateStr.split(' ');
                const monthMap = {
                    'Jan': 0,
                    'Feb': 1,
                    'Mar': 2,
                    'Apr': 3,
                    'May': 4,
                    'Jun': 5,
                    'Jul': 6,
                    'Aug': 7,
                    'Sep': 8,
                    'Oct': 9,
                    'Nov': 10,
                    'Dec': 11
                };
                const date = new Date(parseInt(year), monthMap[month], parseInt(day));

                // Parse amount
                const amount = parseFloat(amountStr.replace(/[£,]/g, ''));

                // Determine transaction type and description
                let type = 'debit';
                let description = '';

                if (line.includes('Opening balance')) {
                    type = 'credit';
                    description = 'Opening Balance';
                } else if (line.includes('Interest earned')) {
                    type = 'credit';
                    description = 'Interest Earned';
                } else if (line.includes("To Kolade's Account")) {
                    type = 'debit';
                    description = 'Transfer Out';
                } else if (line.includes('Closing balance')) {
                    type = 'credit';
                    description = 'Closing Balance';
                }

                // Skip invalid transactions
                if (isNaN(amount) || !description) {
                    continue;
                }

                transactions.push({
                    date: date.toISOString(),
                    description,
                    amount,
                    type
                });

                console.log('Found transaction:', {
                    date: date.toISOString(),
                    description,
                    amount,
                    type
                });
            }
        }
    }

    return transactions;
}

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Access from iOS simulator: http://localhost:3000');
    console.log('Access from physical device: http://192.168.0.210:3000');
});