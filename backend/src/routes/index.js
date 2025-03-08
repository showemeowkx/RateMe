const express = require("express");

const mainRouter = require("./main-page-rt");

const router = express.Router();

router.use("/", mainRouter);

module.exports = router;
