const express = require('express');
const jsonServer = require('json-server');
const path = require('path');

const app = express();

// Define the port
const port = process.env.PORT || 3000;

// Define the path to the db.json file
const dbPath = path.join(__dirname, 'db.json');

// Create an instance of the JSON Server router
const jsonRouter = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults();

// Use the middlewares of JSON Server
app.use(middlewares);
app.use(express.json());

// Add a custom route for the login endpoint
app.post('/login', (req, res) => {
  // Handle login logic here
  // You can use jsonRouter.db.get(...) to interact with the database if needed
  res.status(404).json({ error: 'Not Found' });
});

// Use the JSON Server router for all routes under /api
app.use('/api', jsonRouter);

// Add a route for the home page
app.get('/', (_req, res) => {
  res.send('TypeScript With Express and JSON Server!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
