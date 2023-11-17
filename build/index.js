// Importez les modules nécessaires
const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

// Créez une application Express
const app = express();

// Définissez le port
const port = process.env.PORT || 3000;

// Définissez le chemin du fichier db.json
const dbPath = path.join(__dirname, 'db.json');

// Créez une instance du routeur JSON Server
const jsonRouter = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// Utilisez les middlewares de JSON Server
app.use(middlewares);
app.use(express.json());

// Ajoutez une route pour les utilisateurs, mais elle sera gérée par JSON Server
app.post('/api/users', (req, res) => {
  // Cette route ne modifie pas directement le fichier db.json
  // car JSON Server s'occupera de cela pour vous.
  res.json(req.body);
});

// Ajoutez une route pour les cours, elle sera également gérée par JSON Server
app.post('/api/courses', (req, res) => {
  // Cette route ne modifie pas directement le fichier db.json
  // car JSON Server s'occupera de cela pour vous.
  res.json(req.body);
});

// Utilisez le routeur JSON Server pour toutes les routes /api
app.use('/api', jsonRouter);

// Ajoutez une route pour la page d'accueil
app.get('/', (_req, res) => {
  res.send("TypeScript With Express and JSON Server!");
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});