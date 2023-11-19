const express = require("express");
const lowdb = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");

const adapter = new FileSync('db.json');
const db = lowdb(adapter);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
db.defaults({ users: [], courses: [] }).write();

// Middleware de validation d'utilisateur
const validateUser = (req, res, next) => {
    const { id, name, roles, email, password } = req.body;

    if (!id || !name || !roles || !email || !password) {
        return res.status(400).json({ error: 'Missing required user information' });
    }

    next();
};

// Middleware de validation de cours
const validateCourse = (req, res, next) => {
    const { id, title } = req.body;

    if (!id || !title) {
        return res.status(400).json({ error: 'Missing required course information' });
    }

    next();
};

// Middleware d'authentification
const authenticateUser = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(401).json({ error: 'Unauthorized - Missing credentials' });
    }

    const user = db.get('users').find({ email, password }).value();

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized - Invalid credentials' });
    }

    req.user = user;
    next();
};


app.post('/login', authenticateUser, (req, res) => {
    const { email } = req.body;
    const user = db.get('users').find({ email }).value();

    if (!user) {
        return res.status(401).json({ error: 'Unauthorized - User not found' });
    }

    res.json({ userId: user.id, roles: user.roles, token: user.email });
});

// Route pour ajouter un utilisateur
app.post('/users', validateUser, (req, res) => {
    const { id, name, roles, email, password } = req.body;
    const user = { id, name, roles, email, password };
    db.get('users').push(user).write();
    res.json(user);
});

// Route pour ajouter un cours
app.post('/courses', validateCourse, (req, res) => {
    const { id, title } = req.body;
    const course = { id, title };
    db.get('courses').push(course).write();
    res.json(course);
});

app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
