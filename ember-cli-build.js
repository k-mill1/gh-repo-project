'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    postcssOptions: {
      compile: {
        enabled: true,
        cacheInclude: [/.*\.(css|scss|hbs|html)$/, /.*\/tailwind\.config\.js$/],
        plugins: [
          { module: require('postcss-import') }, // If you installed postcss-import
          require('tailwindcss'),
          require('tailwindcss')('./tailwind.config.js'), // If you have a Tailwind config file.
          require('autoprefixer'),
        ],
      },
    },
  });

  return app.toTree();
};
