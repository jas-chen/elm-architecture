const path = require("path");
const src = path.join(__dirname, "src");

module.exports = {
  context: src,
  entry: {
    main: ["./index.js"]
  },
  output: {
    path: path.join(__dirname, "build"),
    filename: "main.js"
  },
  devServer: { inline: true }
};