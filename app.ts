import express, { Application, Request, Response, NextFunction } from 'express';
import * as bodyParser from 'body-parser';
import lowdb from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

// Définissez votre modèle utilisateur
interface User {
  id: number;
  name: string;
  roles: string[];
  email: string;
  password: string;
}

// Définissez l'interface AuthenticatedRequest ici
interface AuthenticatedRequest extends Request {
  user?: User;
}

const app: Application = express();
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

app.use(bodyParser.json());

// Middleware de validation d'utilisateur
const validateUser = (req: Request, res: Response, next: NextFunction) => {
  const { id, name, roles, email, password } = req.body;

  if (!id || !name || !roles || !email || !password) {
    return res.status(400).json({ error: 'Missing required user information' });
  }

  next();
};

// Middleware de validation de cours
const validateCourse = (req: Request, res: Response, next: NextFunction) => {
  const { id, title } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'Missing required course information' });
  }

  next();
};

// Middleware d'authentification
const authenticateUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.body.token;
  const password = req.body.password;

  if (!token || !password) {
    return res.status(401).json({ error: 'Unauthorized - Missing credentials' });
  }

  // Vérifiez le jeton et le mot de passe dans votre système d'authentification
  const user = db.get('users').value().find((user: User) => user.email === token && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized - Invalid credentials' });
  }

  req.user = user;
  next();
};

// Middleware d'autorisation pour les rôles admin
const authorizeAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userRoles = req.user?.roles;

  if (!userRoles || !userRoles.includes('admin')) {
    return res.status(403).json({ error: 'Forbidden' });
  }


  next();
};

// Change the type of users and courses to be array-like
const users: User[] = db.get('users').value();
const courses: any[] = db.get('courses').value(); // You should replace 'any' with the actual type of your courses

// Now you can use find and push without TypeScript errors

// Route for user login
app.post('/login', authenticateUser, (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = users.find((user: User) => user.email === email && user.password === password);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized - Invalid credentials' });
  }

  res.json({ userId: user.id, roles: user.roles, token: user.email });
});

// Route for adding a user
app.post('/users', validateUser, (req: Request, res: Response) => {
  const { id, name, roles, email, password } = req.body;
  const user = { id, name, roles, email, password };
  users.push(user);
  db.set('users', users).write();
  res.json(user);
});


app.get('/courses', authenticateUser, (req: Request, res: Response) => {
  const courses = db.get('courses').value();
  res.json(courses);
});

app.post('/users', authenticateUser, authorizeAdmin, validateUser, (req: Request, res: Response) => {
  const { id, name, roles, email, password } = req.body;
  const user: User = { id, name, roles, email, password }; // Provide the 'password' property
  users.push(user);
  db.set('users', users).write();
  res.json(user);
});


app.post('/courses', authenticateUser, authorizeAdmin, validateCourse, (req: Request, res: Response) => {
  const { id: courseId, title: courseTitle } = req.body;
  const course = { id: courseId, title: courseTitle };

  courses.push(course);
  db.set('courses', courses).write();
  res.json(course);
});

// Gestionnaire d'erreurs global
app.use((err: Error, req: Request, res: Response) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
