var glob = require('glob');
var swPrecache = require('sw-precache');
var util = require('gulp-util');

module.exports = function(rootDir, handleFetch, callback) {
  var regex = /([^\/]+)\.html$/;
  var templateDir = rootDir + '/templates/';
  var dynamicUrlToDependencies = {
    './': [templateDir + 'layout_full.html', templateDir + 'home.html'],
    './?partial': [templateDir + 'layout_partial.html', templateDir + 'home.html']
  };

  // This isn't pretty, but it works for our dynamic URL mapping.
  glob.sync(templateDir + '!(layout_*).html').forEach(function(template) {
    var matches = template.match(regex);
    if (matches) {
      var path = matches[1];
      var partialPath = path + '?partial';
      dynamicUrlToDependencies[path] = [templateDir + 'layout_full.html', template];
      dynamicUrlToDependencies[partialPath] = [templateDir + 'layout_partial.html', template];
    }
  });

  var config = {
    dynamicUrlToDependencies: dynamicUrlToDependencies,
    handleFetch: handleFetch,
    importScripts: [
      'bower_components/shed/dist/shed.js',
      'scripts/shed/offline-analytics.js',
      'scripts/shed/cache-then-network.js',
      'scripts/shed/google-fonts.js',
      'scripts/shed/experiment.js'
    ],
    logger: util.log,
    staticFileGlobs: [
      rootDir + '/bower_components/**/*.{html,js,css}',
      rootDir + '/elements/**',
      rootDir + '/fonts/**',
      rootDir + '/images/**',
      rootDir + '/scripts/**',
      rootDir + '/styles/**/*.css',
      rootDir + '/templates/**/*_partial.html',
      rootDir + '/*.{html,ico,json}'
    ],
    stripPrefix: rootDir + '/'
  };

  swPrecache(config, callback);
};
