const { getLoader, loaderByName } = require('@craco/craco')

const deleteItemByConstructorName = (array, name) => {
  const index = array.findIndex(item => Object.getPrototypeOf(item).constructor.name === name)
  index !== -1 && array.splice(index, 1)
}

module.exports = {
  eslint: {
    configure: {
      rules:  {
        'react-hooks/exhaustive-deps': 'off',
      },
    },
  },
  webpack: {
    configure: webpackConfig => {
      webpackConfig.output.publicPath = '.'
      getLoader(webpackConfig, loaderByName('babel-loader')).match.loader.include = /\.tsx?$/
      deleteItemByConstructorName(webpackConfig.resolve.plugins, 'ModuleScopePlugin')
      deleteItemByConstructorName(webpackConfig.plugins, 'ManifestPlugin')
      deleteItemByConstructorName(webpackConfig.plugins, 'GenerateSW')
      return webpackConfig
    },
  },
}
