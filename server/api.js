require('dotenv').config(); // Lädt die Umgebungsvariablen aus der .env-Datei
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./database'); // Importiere die initialisierte Datenbankverbindung

const posts = [
  {
    id: 1,
    title: "Introduction to JavaScript",
    content: "JavaScript is a dynamic language primarily used for web development...",
  },
  {
    id: 2,
    title: "Functional Programming",
    content: "Functional programming is a paradigm where functions take center stage...",
  },
  {
    id: 3,
    title: "Asynchronous Programming in JS",
    content: "Asynchronous programming allows operations to run in parallel without blocking the main thread...",
  }
];

const initializeAPI = async (app) => {
  app.post("/api/login",
    body('username')
      .notEmpty().withMessage('Username is required')
      .isEmail().withMessage('Username must be a valid email address')
      .trim().escape(),
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 10 }).withMessage('Password must be at least 10 characters long')
      .trim().escape(),
    login
  );

  // Neuer GET-Endpunkt zum Abrufen von Beispieldaten
  app.get("/api/posts", (req, res) => {
    res.status(200).json(posts);
  });
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed. Please check your input.',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, row) => {
    if (err) {
      console.error('Error querying database:', err.message);
      return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }

    if (!row) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    try {
      const match = await bcrypt.compare(password, row.password);
      if (match) {
        const token = jwt.sign(
          { username: row.username },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );

        return res.status(200).json({
          message: 'Login successful!',
          token: token
        });
      } else {
        return res.status(401).json({ message: 'Invalid username or password.' });
      }
    } catch (error) {
      console.error('Error comparing password:', error);
      return res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
  });
};

module.exports = { initializeAPI };
