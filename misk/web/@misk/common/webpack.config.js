const path = require('path');

module.exports = {
  name: "library",
  mode: 'production',
  entry: {
    common: path.resolve(__dirname, 'src/index.ts'),
    externals: path.resolve(__dirname, 'src/externals.ts'),
    interfaces: path.resolve(__dirname, 'src/interfaces.ts')
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, './lib'),
    filename: '[name].js',
    library: ['Misk', 'Common'],
    libraryTarget: 'umd',
    globalObject: 'typeof window !== \'undefined\' ? window : this'
  },
  module: {
    rules: [
      { 
        test: /\.(ts|tsx)?$/, 
        loader: 'awesome-typescript-loader'
      }
    ]
  },
  resolve: {
    extensions: [".ts", ".tsx"]
  },
};