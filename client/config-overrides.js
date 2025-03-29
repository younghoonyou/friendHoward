const { ESBuildMinifyPlugin } = require('esbuild-loader');

module.exports = function override(config, env) {
  // Replace babel-loader with esbuild-loader
  const oneOfRule = config.module.rules.find(rule => rule.oneOf);
  
  if (oneOfRule) {
    const jsLoaderIndex = oneOfRule.oneOf.findIndex(
      rule => rule.test && rule.test.toString().includes('js')
    );

    const tsLoaderIndex = oneOfRule.oneOf.findIndex(
      rule => rule.test && rule.test.toString().includes('ts')
    );

    if (jsLoaderIndex !== -1) {
      oneOfRule.oneOf[jsLoaderIndex] = {
        test: /\.(js|mjs|jsx)$/,
        include: oneOfRule.oneOf[jsLoaderIndex].include,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('esbuild-loader'),
          options: {
            loader: 'jsx',
            target: 'es2015'
          }
        }
      };
    }

    if (tsLoaderIndex !== -1) {
      oneOfRule.oneOf[tsLoaderIndex] = {
        test: /\.(ts|tsx)$/,
        include: oneOfRule.oneOf[tsLoaderIndex].include,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('esbuild-loader'),
          options: {
            loader: 'tsx',
            target: 'es2015'
          }
        }
      };
    }
  }

  if (env === 'production') {
    config.optimization.minimizer = [
      new ESBuildMinifyPlugin({
        target: 'es2015',
        css: true  // Apply minification to CSS assets
      })
    ];
  }

  // Special handling for Three.js
  config.module.rules.unshift({
    test: /three\/examples\/jsm/,
    use: {
      loader: require.resolve('esbuild-loader'),
      options: {
        loader: 'jsx',
        target: 'es2015'
      }
    }
  });

  return config;
};