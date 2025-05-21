const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const session = require('express-session');
const app = express();

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

// File upload setup
const MAX_SIZE = 3 * 1024; // 3KB
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: MAX_SIZE }
});

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
        const fileSize = req.file.size;
        console.log('Uploaded file size (bytes):', fileSize);

        // Check if the file size exceeds the max size
        if (fileSize > MAX_SIZE) {
            // Save the code and language to session and redirect to sign-up
            req.session.pendingCode = req.file.buffer.toString();
            req.session.pendingLang = detectLanguageFromFile(req.file.originalname);

            console.log('Redirecting to sign-up due to file size limit.');
            return res.redirect('/sign-up');
        }

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

// Sign-up page
app.get('/sign-up', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'sign-up.html'));
});

// Handle sign-up (form)
app.post('/sign-up', (req, res) => {
    const { username, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('❌ Passwords do not match.');
    }

    console.log(`✅ User ${username} signed up.`);

    const pendingCode = req.session.pendingCode;
    const pendingLang = req.session.pendingLang;

    if (pendingCode && pendingLang) {
        delete req.session.pendingCode;
        delete req.session.pendingLang;
        return runCode(pendingLang, pendingCode, res);
    }

    res.send(`✅ User ${username} registered successfully!`);
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Start server
app.listen(3000, () => {
    console.log('✅ Server running on http://localhost:3000');
});



