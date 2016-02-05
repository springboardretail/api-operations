const path = require('path')
const webpack = require('webpack')

const dirSrc = path.resolve(__dirname, 'src')
const dirDist = path.resolve(__dirname, 'dist')


const common = {
  entry: path.resolve(dirSrc, 'index.js'),
  output: {
    path: dirDist,
    filename: 'api-operations.js',
    library: 'apiOperations',
    libraryTarget: 'umd',
  },
  resolve: {
    root: dirSrc,
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        exclude: /node_modules/,
        test: /\.js?$/,
      },
    ],
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
  ],
  stats: {
    colors: true,
  },
}


const TARGET = process.env.npm_lifecycle_event

if (TARGET === 'build:umd') {
  module.exports = common
}

if (TARGET === 'build:umd:min') {
  module.exports = Object.assign({}, common, {
    output: Object.assign({}, common.output, { filename: 'api-operations.min.js' }),
  })
}
