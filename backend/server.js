const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const app = express();

const port = process.env.PORT || 8080;

app.use("/", (req, res) => {
  res.send("Qayyum and Ayoola Colab Todo App!");
});

app.listen(port, () => {
  console.log("Server is running on port", port);
});
