import express, { Request, Response } from 'express';
import low, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

// Interface pour définir la structure d'un utilisateur
interface User {
  id: number;
  email: string;
  password: string;
  role: string;
}

interface Course {
  id: number;
  title: string;
  date: string;
}

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

interface Database {
  users: User[];
  courses: Course[];
}

const adapter = new FileSync<Database>('build/db.json');
const db: LowdbSync<Database> = low(adapter);

app.post('/api/users', (req: Request, res: Response) => {
  const newUser = req.body as User;

  const users = db.get('users').value();

  newUser.id = users.length + 1;

  db.get('users').push(newUser).write();

  res.json(newUser);
});

app.post('/api/courses', (req: Request, res: Response) => {
  const newCourse = req.body as Course;

  const courses = db.get('courses').value();

  newCourse.id = courses.length + 1;

  db.get('courses').push(newCourse).write();

  res.json(newCourse);
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
