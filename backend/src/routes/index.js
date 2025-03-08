const express = require("express");

const mainRouter = require("./mainPage");

const router = express.Router();

router.use("/", mainRouter);

module.exports = router;
