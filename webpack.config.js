module.exports = {
  entry: './src/index.js',
  output: {
    path: __dirname + "/libs",
      filename: 'libpack.js',
      library: 'libpack',
      libraryTarget:'umd'
  }
};