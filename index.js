const express = require("express");
const bodyParser = require("body-parser");
const { createReadStream } = require("fs");

const { createApp } = require("./app.js");

const app = createApp(
  express,
  bodyParser,
  createReadStream,
  __filename
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
