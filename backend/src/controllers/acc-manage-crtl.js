const path = require("path");
const qs = require("querystring");
// eslint-disable-next-line no-undef
const publicPath = path.join(__dirname, "../public");

const accManageGet = (req, res) =>
  res.sendFile(`${publicPath}/acc-manage.html`);

const accManagePost = (req, res) => {
  let data = "";
  req.on("data", (chunk) => (data += chunk.toString()));
  req.on("end", () => {
    const parsedData = qs.parse(data);
    res.send(
      `<h1>Successfully sent data!</h1> 
       <h2>Login: ${parsedData.login}
        <br> 
      Password: ${parsedData.password}</h2>`
    );
    console.log(parsedData);
  });
};

module.exports = { accManageGet, accManagePost };
