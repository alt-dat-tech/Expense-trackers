const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MongoDB Connection
const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db("myDatabase");
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
    }
}

connectToMongoDB();
app.use(express.static('public'));
app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});
app.get(['/signup.html','/register.html'], (req, res) => {
    res.sendFile(path.join(__dirname,'register.html'));
});
app.get('/home.html', (req, res) => {
    res.sendFile(path.join(__dirname , 'home.html'));
});
app.get('/income.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'income.html'));
});
app.get('/expense.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'expense.html'));
});
app.get('/transactions.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'transactions.html'));
});
app.get('/email.html', (req, res) => {
    res.sendFile(path.join(__dirname,  'email.html'));
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const usersCollection = db.collection('users'); 
        const existingUser = await usersCollection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }
        await usersCollection.insertOne({ username, password });
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const usersCollection = db.collection('users');
        const user = await usersCollection.findOne({ username, password });
        if (user) {
            res.status(200).json({ message: "Login successful" });
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
