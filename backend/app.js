require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const router = require("./src/routes/index");

const app = express();
// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(router);

app.listen(PORT, () =>
  console.log(`Server is listening on http://localhost:${PORT}!`)
);
