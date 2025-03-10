const express = require("express");
const {
  addReviewGet,
  addReviewPost,
} = require("../controllers/add-review-crtl");

const router = express.Router();

router.get("/", addReviewGet);
router.post("/", addReviewPost);

module.exports = router;
