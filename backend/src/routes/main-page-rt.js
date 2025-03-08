const express = require("express");

const { mainRootCtrl } = require("../controllers/main-page-ctrl.js");

const router = express.Router();

router.get("/", mainRootCtrl);

module.exports = router;
