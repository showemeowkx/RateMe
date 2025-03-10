const path = require("path");
// eslint-disable-next-line no-undef
const publicPath = path.join(__dirname, "../public");

const mainRootCtrl = (req, res) => res.sendFile(`${publicPath}/main-page.html`);

module.exports = { mainRootCtrl };
