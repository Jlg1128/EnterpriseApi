const publicRouters = require("./public");
const privateRouters = require("./private");

module.exports = Object.assign(publicRouters, privateRouters);