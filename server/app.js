const express = require("express");
const http = require("http");
const rateLimit = require("express-rate-limit");
const { initializeAPI } = require("./api");

// Create the express server
const app = express();
app.use(express.json());
const server = http.createServer(app);

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50, // Limit each IP to 50 requests per windowMs
  message: {
    message: "Too many requests from this IP, please try again after a minute."
  }
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

// deliver static files from the client folder like css, js, images
app.use(express.static("client"));
// route for the homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/client/index.html");
});

// Initialize the REST api
initializeAPI(app);

// start the web server
const serverPort = 3000;
server.listen(serverPort, () => {
  console.log(`Express Server started on port ${serverPort}`);
});
