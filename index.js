const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorHandler = require("./error/error-handler");

//* Load env vars
//* deployda burayı yoruma al

dotenv.config({
  path: "./config/config.env",
});

//? Connect to database
connectDB();

//* Route files
const fighters = require("./routes/fighters");

const fights = require("./routes/fight");
const authentication = require("./routes/authentication");
const users = require("./routes/users");
const fighterFights = require("./routes/fighter-fight");

const app = express();
app.use(cors());

//app.use(express.json());
app.use(express.json({ limit: "50mb" }));
//* Cookie Parser
app.use(cookieParser());

app.use("/mma-api/fighters", fighters);

app.use("/mma-api/fighter-fight", fighterFights);
app.use("/mma-api/fights", fights);
app.use("/mma-api/authentication", authentication);
app.use("/mma-api/users", users);

app.get("/", (req, res) => {
  res.send("Hey this is my API running 🥳");
});

const PORT = process.env.PORT || 5000;
//app.listen(PORT, console.log(`Server running in ${process.env.PORT}`.yellow));
app.use(errorHandler);
const startServer = async () => {
  await app.listen(
    PORT,
    console.log(`Server running in ${process.env.PORT}`.yellow)
  );
};

startServer();

module.exports = app;
