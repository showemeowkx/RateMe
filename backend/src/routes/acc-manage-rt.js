const express = require("express");
const {
  accManageGet,
  accManagePost,
} = require("../controllers/acc-manage-crtl");

const router = express.Router();

router.get("/", accManageGet);
router.post("/", accManagePost);

module.exports = router;
