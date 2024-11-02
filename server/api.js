const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const initializeAPI = async (app) => {
  app.post("/api/login",
    body('username')
      .notEmpty().withMessage('Username is required')
      .isEmail().withMessage('Username must be a valid email address')
      .trim().escape(), // Sanitization: trim whitespace and escape special characters
    body('password')
      .notEmpty().withMessage('Password is required')
      .isLength({ min: 10 }).withMessage('Password must be at least 10 characters long')
      .trim().escape(), // Sanitization: trim whitespace and escape special characters
    login
  );
};

const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Return a cleaner formatted response with user-friendly error messages
    return res.status(400).json({
      message: 'Validation failed. Please check your input.',
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  const { username, password } = req.body;

  try {
    // Hash the password with a salt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const answer = `
      <h1>Answer</h1>
      <p>Username: ${username}</p>
      <p>Password (Hashed): ${hashedPassword}</p>
    `;

    res.send(answer);
  } catch (error) {
    console.error("Error hashing password:", error);
    res.status(500).json({ message: "An error occurred while processing your request." });
  }
};

module.exports = { initializeAPI };
