const express = require("express");
const app = express();
const Connection = require("./connection/connection");
const jwt = require("jsonwebtoken");
const { authenticateJWT } = require("./middleware/auth");
const sequelize = require("sequelize");

const dotenv = require("dotenv");
//connectionsync=require('./sync/sync')

const bodyParser = require("body-parser");
//convert into json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var path = require("path");
var cors = require("cors");
dotenv.config();

// app.use("/", (req, res, next) => {
Connection.connection
  .authenticate()
  .then(() => {
    console.log("Database connected...");
    app.listen(process.env.PORT || 8080, () =>
      console.log("server is listening at port 8080")
    );
  })
  .catch((err) => {
    console.log("Error...", err);
    // res.redirect("/error");
  });
// });

app.use(cors());

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    message: err.message,
    errors: err.errors,
  });
});

// For heroku
app.get("/", async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  res.send("Server is running 🚀!");
});

app.use("/error", (req, res, next) => {
  res.send("connection not authenticated");
});

//Routes
const profile = require("./routes/users/profile");
const locations = require("./routes/locations/location");

// URL
app.use("/profile", profile);
app.use("/locations", locations);
