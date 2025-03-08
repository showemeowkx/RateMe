const express = require("express");

const { mainRootCtrl } = require("../controllers/mainPage.js");

const router = express.Router();

router.get("/", mainRootCtrl);

module.exports = router;
