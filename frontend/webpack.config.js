const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  // ...existing code...
  optimization: {
    minimize: true,
    minimizer: [
      // ...existing minimizers...
      new CssMinimizerPlugin(),
    ],
  },
  // ...existing code...
};