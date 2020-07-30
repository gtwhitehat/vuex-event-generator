module.exports = {
  entry: './src/index.js',
  output: {
    globalObject: "this",
    path: __dirname + "/libs",
    filename: 'libpack.js',
    library: 'libpack',
    libraryTarget:'umd'
  }
};