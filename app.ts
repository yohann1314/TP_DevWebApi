import express, { Request, Response } from 'express';
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import jsonServer from 'json-server';

const app = express();
const port = process.env.PORT || 3000;

const server = jsonServer.create();
const jsonRouter = jsonServer.router('build/db.json');
const middlewares = jsonServer.defaults();

app.use(middlewares);
app.use(express.json());

// Routes pour les opérations POST sur les utilisateurs
app.post('/api/users', (req: Request, res: Response) => {
  const newUser = req.body;

  // Charger les utilisateurs depuis le fichier db.json
  const users = require('./build/db.json').users;

  // Ajouter un nouvel utilisateur avec un ID incrémenté
  newUser.id = users.length + 1;

  // Mettre à jour db.json avec le nouvel utilisateur
  const db = low(new FileSync('build/db.json'));
  db.get('users').push(newUser).write();

  res.json(newUser);
});

// Routes pour les opérations POST sur les cours
app.post('/api/courses', (req: Request, res: Response) => {
  const newCourse = req.body;

  // Charger les cours depuis le fichier db.json
  const db = low(new FileSync('build/db.json'));
  const courses = db.get('courses').value();

  // Ajouter un nouveau cours avec un ID incrémenté
  newCourse.id = courses.length + 1;

  // Mettre à jour db.json avec le nouveau cours
  db.get('courses').push(newCourse).write();

  res.json(newCourse);
});  

app.use('/api', jsonRouter);

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
