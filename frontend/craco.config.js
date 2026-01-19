// craco.config.js
const path = require("path");
require("dotenv").config();

// Ortam değişkeni geçersiz kılmaları
const config = {
  disableHotReload: process.env.DISABLE_HOT_RELOAD === "true",
  enableVisualEdits: process.env.REACT_APP_ENABLE_VISUAL_EDITS === "true",
  enableHealthCheck: process.env.ENABLE_HEALTH_CHECK === "true",
};

// Yalnızca etkinleştirilmişse görsel düzenleme modüllerini koşullu olarak yükle
let babelMetadataPlugin;
let setupDevServer;

if (config.enableVisualEdits) {
  babelMetadataPlugin = require("./plugins/visual-edits/babel-metadata-plugin");
  setupDevServer = require("./plugins/visual-edits/dev-server-setup");
}

// Yalnızca etkinleştirilmişse sağlık kontrolü modüllerini koşullu olarak yükle
let WebpackHealthPlugin;
let setupHealthEndpoints;
let healthPluginInstance;

if (config.enableHealthCheck) {
  WebpackHealthPlugin = require("./plugins/health-check/webpack-health-plugin");
  setupHealthEndpoints = require("./plugins/health-check/health-endpoints");
  healthPluginInstance = new WebpackHealthPlugin();
}

const webpackConfig = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    configure: (webpackConfig) => {

      // Ortam değişkeni ayarlanmışsa hot reload’u tamamen devre dışı bırak
      if (config.disableHotReload) {
        // Hot reload ile ilgili eklentileri kaldır
        webpackConfig.plugins = webpackConfig.plugins.filter(plugin => {
          return !(plugin.constructor.name === 'HotModuleReplacementPlugin');
        });

        // İzleme modunu devre dışı bırak
        webpackConfig.watch = false;
        webpackConfig.watchOptions = {
          ignored: /.*/, // Ignore all files
        };
      } else {
        // İzlenen dizinleri azaltmak için yok sayılan desenler ekle
        webpackConfig.watchOptions = {
          ...webpackConfig.watchOptions,
          ignored: [
            '**/node_modules/**',
            '**/.git/**',
            '**/build/**',
            '**/dist/**',
            '**/coverage/**',
            '**/public/**',
          ],
        };
      }

      // Etkinleştirilmişse health check eklentisini webpack’e ekle
      if (config.enableHealthCheck && healthPluginInstance) {
        webpackConfig.plugins.push(healthPluginInstance);
      }

      return webpackConfig;
    },
  },
};

// Babel eklentisini yalnızca görsel düzenleme etkinse ekle
if (config.enableVisualEdits) {
  webpackConfig.babel = {
    plugins: [babelMetadataPlugin],
  };
}

// Geliştirme sunucusunu görsel düzenlemeler ve/veya sağlık kontrolü ile yapılandır
if (config.enableVisualEdits || config.enableHealthCheck) {
  webpackConfig.devServer = (devServerConfig) => {
    // Etkinleştirildiyse görsel düzenlemeler için geliştirme sunucusu ayarlarını uygula
    if (config.enableVisualEdits && setupDevServer) {
      devServerConfig = setupDevServer(devServerConfig);
    }

    // Etkinleştirildiyse sağlık kontrolü uç noktalarını ekle
    if (config.enableHealthCheck && setupHealthEndpoints && healthPluginInstance) {
      const originalSetupMiddlewares = devServerConfig.setupMiddlewares;

      devServerConfig.setupMiddlewares = (middlewares, devServer) => {
        // Mevcutsa orijinal kurulumu çağır
        if (originalSetupMiddlewares) {
          middlewares = originalSetupMiddlewares(middlewares, devServer);
        }

        // Sağlık uç noktalarını yapılandır
        setupHealthEndpoints(devServer, healthPluginInstance);

        return middlewares;
      };
    }

    return devServerConfig;
  };
}

module.exports = webpackConfig;
