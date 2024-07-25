const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jsonfile = require('jsonfile');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const dbPath = path.join(__dirname, 'db.json');

// Load the database
function loadDB() {
    return jsonfile.readFileSync(dbPath);
}

// Save to the database
function saveDB(data) {
    jsonfile.writeFileSync(dbPath, data, { spaces: 2 });
}

// Check if username exists
function isUsernameTaken(username) {
    const db = loadDB();
    return db.users.some(user => user.username === username);
}

// Register new user
app.post('/users', async (req, res) => {
    const { username, password } = req.body;

    if (isUsernameTaken(username)) {
        return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const db = loadDB();
    const newUser = { id: Date.now().toString(), username, password: hashedPassword };

    db.users.push(newUser);
    saveDB(db);
    res.status(201).json(newUser);
});

// Login user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = loadDB();

    const user = db.users.find(user => user.username === username);
    if (!user) {
        return res.status(401).json({ error: 'Invalid username or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
        res.status(200).json({ message: 'Login successful' });
    } else {
        res.status(401).json({ error: 'Invalid username or password' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
