// Karma configuration
// Generated on Tue Dec 19 2017 18:23:34 GMT+0530 (India Standard Time)

module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            './node_modules/angular/angular.js', // angular
            './node_modules/angular-ui-router/release/angular-ui-router.js', // ui-router
            'src/lib/js/angularjs/angular-route.js',
	          './node_modules/angular-ui-grid/ui-grid.js',
            './node_modules/angular-mocks/angular-mocks.js', // loads our modules for tests
            'src/app/**/*.js',
            'src/app/templates/*.html',
            'tests/unit/app/**/*.js' // our test file for our Users factory
        ],


        // list of files to exclude
        exclude: [],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {},


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,

	// test results reporter to use
    	// possible values: 'dots', 'progress'
    	// available reporters: https://npmjs.org/browse/keyword/karma-reporter
   	 reporters: ['progress','junit'],

    	plugins: [
     	 'karma-jsdom-launcher',
    	 'karma-jasmine',
      	 'karma-junit-reporter',
      	 'karma-chrome-launcher'
    	],
    	junitReporter: {
      	useBrowserName: false,
      	outputFile: 'unit.xml',
      	suite: 'unit'
    	},
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        browserConsoleLogOptions: {
            terminal: true,
            level: ""
        },
        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['jsdom'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity
    })
}
