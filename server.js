const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const app = express();
const requireEnvConfig = require('./dotenv/config')


console.log(process.env.pk);
// Define middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets 
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
} else {
  app.use(express.static("client/public"))
}

//  API routes

app.use('/api', require('./routes/api-routes'))

// Send every other request to the React app
if (process.env.NODE_ENV === "production") {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/build/index.html"));
  });
} else {
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./client/public/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Express server now is up and running on port ${PORT}!`);
});
