const path = require("path");
const qs = require("querystring");
// eslint-disable-next-line no-undef
const publicPath = path.join(__dirname, "../public");

const addReviewGet = (req, res) =>
  res.sendFile(`${publicPath}/add-review.html`);

const addReviewPost = (req, res) => {
  let data = "";
  req.on("data", (chunk) => (data += chunk.toString()));
  req.on("end", () => {
    const parsedData = qs.parse(data);
    res.send("<h1>Successfully send request!</h1>");
    console.log(parsedData);
  });
};

module.exports = { addReviewGet, addReviewPost };
