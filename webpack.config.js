const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: { path: path.resolve(__dirname, 'dist') },
  // mode: "production", // Passed in as command line option
  stats: {},
  resolve: {
    fallback: {
      fs: false,
      tls: false,
      net: false,
      stream: false,
      crypto: false,
      'crypto-browserify': false,
      buffer: false,
      util: false,
      assert: false,
      url: false,
      https: false,
      http: false,
    },
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-transform-runtime'],
          },
        },
      },
      {
        test: /\.css/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
}
