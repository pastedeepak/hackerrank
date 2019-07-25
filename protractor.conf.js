var HtmlScreenshotReporter = require('protractor-jasmine2-screenshot-reporter');

var reporter = new HtmlScreenshotReporter({
  dest: __dirname + '/tests/e2e/screenshots',
  preserveDirectory: true
});

exports.config = {

  allScriptsTimeout: 11000,

  specs: [
    'tests/e2e/scenarios/*.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  onPrepare: function() {
      jasmine.getEnv().addReporter(reporter);
  }
};