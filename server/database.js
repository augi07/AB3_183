const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

// Initialisieren der Verbindung zur SQLite-Datenbank
const db = new sqlite3.Database('./users.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    // Erstelle die Tabelle, falls sie noch nicht existiert
    db.run(`CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT
    )`, (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      } else {
        console.log('Users table initialized.');
        // Benutzer einfügen, wenn die Tabelle erfolgreich erstellt wurde
        insertUser('test@gmail.com', '1234567890');
      }
    });
  }
});

// Funktion zum Einfügen eines Benutzers in die Datenbank
const insertUser = async (username, password) => {
  try {
    // Passwort hashen
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Benutzer in die Datenbank einfügen
    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint')) {
          console.log('Username already exists. Skipping insert.');
        } else {
          console.error('Error inserting user:', err.message);
        }
      } else {
        console.log(`User ${username} inserted with ID ${this.lastID}`);
      }
    });
  } catch (error) {
    console.error('Error hashing password:', error);
  }
};

module.exports = db;
