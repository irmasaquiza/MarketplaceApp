const path = require('path');
const fs = require('fs');
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);
const defaultResolveRequest = config.resolver.resolveRequest;

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'tslib/modules' || moduleName === 'tslib/modules/index.js') {
    return {
      filePath: path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js'),
      type: 'sourceFile',
    };
  }

  if (moduleName === '@apollo/client' || moduleName.startsWith('@apollo/client/')) {
    const subpath = moduleName === '@apollo/client'
      ? 'core'
      : moduleName.replace('@apollo/client/', '');
    const cjsPath = path.resolve(__dirname, 'node_modules/@apollo/client/__cjs', subpath, 'index.cjs');

    if (fs.existsSync(cjsPath)) {
      return {
        filePath: cjsPath,
        type: 'sourceFile',
      };
    }
  }

  return defaultResolveRequest
    ? defaultResolveRequest(context, moduleName, platform)
    : context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
