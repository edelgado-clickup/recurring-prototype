/**
 * @supernova-test/supernova-sdk
 * 
 * Shared Supernova SDK utilities for fetching design tokens, components, and assets.
 * This package provides scripts and utilities that can be used across all apps in the monorepo.
 */

const path = require('path');

module.exports = {
  // Paths to generated outputs
  paths: {
    tokens: path.join(__dirname, 'output/tokens'),
    components: path.join(__dirname, 'output/components'),
    assets: path.join(__dirname, 'output/assets'),
  },
  
  // Version info
  version: require('./package.json').version,
};
