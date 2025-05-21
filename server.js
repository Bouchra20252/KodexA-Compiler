const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const session = require('express-session');
const app = express();
const upload = multer(); // Use memory storage by default


const historyFile = 'history.json';

// Load and save history
function loadHistory() {
    if (fs.existsSync(historyFile)) {
        return JSON.parse(fs.readFileSync(historyFile, 'utf-8'));
    }
    return [];
}

function saveHistory(history) {
    fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

let history = loadHistory();

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // true if HTTPS
}));



// Language detection
function detectLanguageFromFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    if (ext === '.java') return 'java';
    if (ext === '.cpp') return 'c++';
    if (ext === '.py') return 'python';
    return 'unknown';
}

function detectLanguageFromCode(code) {
    if (code.includes('class') && code.includes('public static void main')) return 'java';
    if (code.includes('#include')) return 'c++';
    if (code.includes('def') || code.includes('print')) return 'python';
    return 'unknown';
}

function extractJavaClassName(code) {
    const match = code.match(/class\s+(\w+)/);
    return match ? match[1] : 'Main';
}

function extractCppClassName(code) {
    return 'Main';
}

// Run the code
function runCode(language, code, res, uploadedFilePath = null) {
    let fileName = '';

    if (language === 'java') {
        const className = extractJavaClassName(code);
        fileName = `${className}.java`;
    } else if (language === 'c++') {
        const className = extractCppClassName(code);
        fileName = `${className}.cpp`;
    } else if (language === 'python') {
        fileName = 'temp.py';
    }

    fs.writeFileSync(fileName, code);

    let command = '';
    if (language === 'java') {
        command = `javac ${fileName} && java ${extractJavaClassName(code)}`;
    } else if (language === 'c++') {
        command = `C:\\msys64\\ucrt64\\bin\\g++.exe ${fileName} -o temp && temp.exe`;
    } else if (language === 'python') {
        command = `python ${fileName}`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            res.json({
                language,
                output: `❌ Error while executing ${language} code:\n${stderr || error.message}`
            });
            cleanup(fileName, language, uploadedFilePath);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.json({
                language,
                output: `⚠ ${language} runtime warning or error:\n${stderr}`
            });
            cleanup(fileName, language, uploadedFilePath);
            return;
        }

        // Save to history
        history.push({ code, language, output: stdout });
        saveHistory(history);

        res.json({ language, output: stdout });
        cleanup(fileName, language, uploadedFilePath);
    });
}

// Clean up temp files
function cleanup(fileName, language, uploadedFilePath) {
    try {
        fs.unlinkSync(fileName);
        if (language === 'c++') fs.unlinkSync('temp');
        if (uploadedFilePath) fs.unlinkSync(uploadedFilePath);
    } catch (cleanupError) {
        console.error(`Cleanup Error: ${cleanupError.message}`);
    }
}

// Run code endpoint
app.post('/run-code', upload.single('file'), (req, res) => {
    let code = req.body.code || '';
    let language = '';

    // Check if file was uploaded
    if (req.file) {
        // Detect language from the uploaded file
        language = detectLanguageFromFile(req.file.originalname);
        code = req.file.buffer.toString();
    } else {
        // Otherwise, detect language from the code provided directly
        language = detectLanguageFromCode(code);
    }

    // If language is unknown, return an error
    if (language === 'unknown') {
        console.error('Unsupported language or unable to detect language.');
        return res.json({ language, output: 'Unsupported language or unable to detect language.' });
    }

    console.log(`Running code in language: ${language}`);
    runCode(language, code, res);
});


// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'frontend.html'));
});

// Start server
app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
});



