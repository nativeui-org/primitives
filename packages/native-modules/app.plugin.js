/**
 * Expo plugin for @native-ui-org/native-modules
 * This plugin ensures the native module is properly linked
 */
const withNativeModules = (config) => {
  // Expo autolinking will automatically detect and link the module
  // based on the expo-module.config.json and package.json configuration
  return config;
};

module.exports = withNativeModules;

