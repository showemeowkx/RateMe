const express = require("express");

const mainRouter = require("./main-page-rt");
const accManageRouter = require("./acc-manage-rt");
const addReviewRouter = require("./add-review-rt");

const router = express.Router();

router.use("/", mainRouter);
router.use("/account", accManageRouter);
router.use("/add-review", addReviewRouter);

module.exports = router;
