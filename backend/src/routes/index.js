const express = require("express");

const mainRouter = require("./main-page-rt");
const accManageRouter = require("./acc-manage-rt");

const router = express.Router();

router.use("/", mainRouter);
router.use("/account", accManageRouter);

module.exports = router;
