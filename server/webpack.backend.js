const path = require('path')

const server = {
  target: 'node',
  mode: 'production',
  entry: './src/main.ts',
  // watch: true,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.mjs'],
    modules: ['node_modules', 'src'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '..', 'dist', 'server'),
    publicPath: 'public',
  },
}

module.exports = [server]
