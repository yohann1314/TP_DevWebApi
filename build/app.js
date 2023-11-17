"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lowdb_1 = __importDefault(require("lowdb"));
const FileSync_1 = __importDefault(require("lowdb/adapters/FileSync"));
const adapter = new FileSync_1.default('db.json');
const db = (0, lowdb_1.default)(adapter);
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
db.defaults({ personnes: [] }).write();
let lastPersonId = 0;
const Person = {
    create: ({ nom, prenom, age }) => {
        const id = (++lastPersonId).toString();
        const personne = { id, nom, prenom, age };
        db.get('personnes').push(personne).write();
        return personne;
    },
    getById: (id) => db.get('personnes').find({ id }).value(),
};
app.post('/ajouter-personne', (req, res) => {
    const { nom, prenom, age } = req.body;
    const nouvellePersonne = Person.create({ nom, prenom, age });
    res.json(nouvellePersonne);
});
app.get('/personne/:id', (req, res) => {
    const personne = Person.getById(req.params.id);
    if (!personne) {
        res.status(404).json({ message: 'Personne non trouvée' });
    }
    else {
        res.json(personne);
    }
});
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur le port ${port}`);
});
