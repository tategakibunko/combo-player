const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    "main": "./src/main.ts"
  },
  output: {
    path: path.join(__dirname, "scripts"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader"
      }
    ]
  }
};
