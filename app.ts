import express, { Request, Response } from 'express';
import low, { LowdbSync } from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';


const adapter = new FileSync('db.json');
const db = low(adapter) as LowdbSync<{ personnes: Person[] }>;

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());


db.defaults({ personnes: [] }).write();

interface Person {
  id: string;
  nom: string;
  prenom: string;
  age: number;
}


let lastPersonId = 0;

const Person = {
  create: ({ nom, prenom, age }: { nom: string; prenom: string; age: number }): Person => {
    const id = (++lastPersonId).toString();
    const personne: Person = { id, nom, prenom, age };
    db.get('personnes').push(personne).write();
    return personne;
  },
  getById: (id: string): Person | undefined => db.get('personnes').find({ id }).value(),
};

app.post('/ajouter-personne', (req: Request, res: Response) => {
  const { nom, prenom, age } = req.body;
  const nouvellePersonne: Person = Person.create({ nom, prenom, age });
  res.json(nouvellePersonne);
});

app.get('/personne/:id', (req: Request, res: Response) => {
  const personne: Person | undefined = Person.getById(req.params.id);
  if (!personne) {
    res.status(404).json({ message: 'Personne non trouvée' });
  } else  {
    res.json(personne);
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
