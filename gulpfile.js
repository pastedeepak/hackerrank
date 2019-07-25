var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');
var es = require('event-stream');
var print = require('gulp-print');
var Q = require('q');
var karmaServer = require('karma').Server;
// var protractor = require("gulp-protractor").protractor;


// == PATH STRINGS ========

var paths = {
    index: './src/index.html',
    partials: ['./src/**/*.html', '!./src/index.html'],
    scripts: ['./src/**/*.js', '!./src/lib/**/*.js'],
    styles: ['./src/**/*.css'],
    fonts: ['./src/**/font/*.*'],
    vendorScripts: ['./src/lib/js/**/*.js'],
    vendorStyles: ['./src/lib/css/**/*.css'],
    images: './src/app/images/**/*',
    data: ['./src/**/*.json'],
    distDev: './build/dev',
    scriptsDevServer: './build/dev/**/*.js',
    distProd: './build/prod',
    distScriptsProd: './build/prod/app/scripts',
    distStylesProd: './build/prod/app/styles',
    e2e: './tests/e2e/scenarios/scenarios.js'
};

// == PIPE SEGMENTS ========

var pipes = {};

// === Validate Partials ===
pipes.validatePartials = function() {
    return gulp.src(paths.partials)
        .pipe(plugins.htmlhint({'doctype-first': false}))
        .pipe(plugins.htmlhint.failReporter());
};

pipes.validatedIndex = function() {
    return gulp.src(paths.index)
        .pipe(plugins.htmlhint())
        .pipe(plugins.htmlhint.failReporter());
};

// === Validate Partials and Index and copy to Dev package ===
pipes.builtPartialsDev = function() {
    return pipes.validatePartials()
        .pipe(gulp.dest(paths.distDev));
};

// == Validate App scripts ====
pipes.validatedAppScripts = function() {
    return gulp.src(paths.scripts)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'));
  //      .pipe(plugins.jshint.reporter('fail'));
};

// === Build App scripts ===
pipes.builtAppScriptsDev = function() {
    return pipes.validatedAppScripts()
        .pipe(gulp.dest(paths.distDev));
};

// === Order the App script files ===
pipes.orderedAppScripts = function() {
    return plugins.angularFilesort();
};

// === Build App script === Mostly Should add LESS or SCSS compiler's

pipes.builtStylesDev = function() {
    return gulp.src(paths.styles)
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtFonts = function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(paths.distDev));
};

// === Build Vendor Scripts =====
pipes.builtVendorStylesDev = function() {
    return gulp.src(paths.vendorStyles)
        .pipe(gulp.dest(paths.distDev+'/lib/css'));
};

// === Vendor Scripts =====
pipes.builtVendorScriptsDev = function() {
    return gulp.src(paths.vendorScripts)
        .pipe(gulp.dest(paths.distDev+'/lib/js'));
};

// ==== Build Partials Production
pipes.builtPartialsProd = function() {
    return pipes.validatePartials()
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.distProd));
};

// === Order of Vendor libraries ====
pipes.orderedVendorScripts = function() {
    return plugins.order(['angularjs/angular.js', 'angularjs/angular-route.js', 'angular-translate/angular-translate.js', 'angularjs/angular-locale_nl-nl.js']);
};

// === Image Processing =====
pipes.processedImagesDev = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distDev + '/app/images/'));
};

// === Build App data files =====
pipes.builtDataDev = function() {
    return gulp.src(paths.data)
        .pipe(gulp.dest(paths.distDev));
};

// === Build the complete Application =====
pipes.builtAppDev = function() {
    return es.merge(pipes.builtIndexDev(), pipes.builtPartialsDev(), pipes.builtDataDev(), pipes.processedImagesDev());
};

// === Build Vendor Styles =====
pipes.builtVendorStylesProd = function() {
    return gulp.src(paths.vendorStyles)
        .pipe(gulp.dest(paths.distStylesProd));
};

// === Build the Vendor Scripts =====
pipes.builtVendorScriptsProd = function() {
    return gulp.src(paths.vendorScripts)
        .pipe(pipes.orderedVendorScripts())
        .pipe(plugins.concat('vendor.min.js'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest(paths.distScriptsProd));
};

// === Build Application for Production =====
pipes.builtAppProd = function() {
    return es.merge(pipes.builtIndexProd(), pipes.processedImagesProd());
};

// === Build all App Scripts =====
pipes.builtAppScriptsProd = function() {
    return pipes.validatedAppScripts()
        .pipe(pipes.orderedAppScripts())
        .pipe(plugins.stripDebug())
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('app.min.js'))
        .pipe(plugins.uglify())
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(paths.distScriptsProd));
};

// ==== Rename styles of css files ====
pipes.minifiedFileName = function() {
    return plugins.rename(function (path) {
        path.extname = '.min' + path.extname;
    });
};

// === Build all App Styles =====
pipes.builtStylesProd = function() {
    return gulp.src(paths.styles)
        .pipe(plugins.sass())
        .pipe(plugins.concatCss('app.css'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.autoprefixer())
        .pipe(plugins.cleanCss({compatibility: 'ie8'}))
        .pipe(plugins.sourcemaps.write())
        .pipe(pipes.minifiedFileName())
        .pipe(gulp.dest(paths.distStylesProd));
};

// === Build Images for Production ====
pipes.processedImagesProd = function() {
    return gulp.src(paths.images)
        .pipe(gulp.dest(paths.distProd + '/app/images/'));
};

// === Build Index.html and move it to Dev env
pipes.builtIndexDev = function() {

    var orderedVendorScripts = pipes.builtVendorScriptsDev()
        .pipe(pipes.orderedVendorScripts());

    var orderedAppScripts = pipes.builtAppScriptsDev()
        .pipe(pipes.orderedAppScripts());

    var vendorStyles = pipes.builtVendorStylesDev();

    var appStyles = pipes.builtStylesDev();

    var appFonts = pipes.builtFonts();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distDev)) // write first to get relative path for inject
        .pipe(plugins.inject(orderedVendorScripts, {relative: true, starttag: '<!-- vendor:{{ext}} -->'}))
        .pipe(plugins.inject(orderedAppScripts, {relative: true, starttag: '<!-- angular:{{ext}} -->'}))
        .pipe(plugins.inject(vendorStyles, {relative: true, starttag: '<!-- vendor:{{ext}} -->'}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.inject(appFonts, {relative: true}))
        .pipe(gulp.dest(paths.distDev));
};

pipes.builtIndexProd = function() {

    var vendorScripts = pipes.builtVendorScriptsProd();
    var appScripts = pipes.builtAppScriptsProd();
    var vendorStyles = pipes.builtVendorStylesProd();
    var appStyles = pipes.builtStylesProd();
    var appTemplates = pipes.builtPartialsProd();
    var appFonts = pipes.builtFonts();

    return pipes.validatedIndex()
        .pipe(gulp.dest(paths.distProd)) // write first to get relative path for inject
        .pipe(plugins.inject(vendorScripts, {relative: true, starttag: '<!-- vendor:{{ext}} -->'}))
        .pipe(plugins.inject(appScripts, {relative: true, starttag: '<!-- angular:{{ext}} -->'}))
        .pipe(plugins.inject(appStyles, {relative: true}))
        .pipe(plugins.inject(appFonts, {relative: true}))
        .pipe(plugins.htmlmin({collapseWhitespace: true, removeComments: true}))
        .pipe(gulp.dest(paths.distProd));
};

// UNIT TESTING
pipes.testUnitTesting = function(done){
    // TODO: CHECK WHY THIS IS NOT WORKING WITH plugins...
    new karmaServer({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
};

// END TO END TESTING
/*pipes.testIntegration = function(){
    new protractor({
        configFile: __dirname + '/protractor.conf.js'
    });
};*/

// == TASKS ========

// removes all compiled dev files
gulp.task('clean-dev', function() {
    var deferred = Q.defer();
    del(paths.distDev, function() {
        deferred.resolve();
    });
    return deferred.promise;
});

// removes all compiled production files
gulp.task('clean-prod', function() {
    var deferred = Q.defer();
    del(paths.distProd, function() {
        deferred.resolve();
    });
    return deferred.promise;
});

gulp.task('e2e', function() {
  return gulp.src(paths.e2e)
      .pipe(
          plugins.angularProtractor({
              'configFile': 'protractor.conf.js',
              'args': ['--baseUrl', 'http://127.0.0.1:8000'],
              'autoStartStopServer': true,
              'debug': true
          })
        );
});

// Checks html source files for syntax errors
gulp.task('validate-partials', pipes.validatePartials);

// Checks index.html for syntax errors
gulp.task('validate-index', pipes.validatedIndex);

// Moves html source files into the dev environment
gulp.task('build-partials-dev', pipes.builtPartialsDev);

// Runs jshint on the app scripts
gulp.task('validate-app-scripts', pipes.validatedAppScripts);

// Moves app scripts into the dev environment
gulp.task('build-app-scripts-dev', pipes.builtAppScriptsDev);

// compiles app and moves to the dev environment
gulp.task('build-styles-dev', pipes.builtStylesDev);

// moves vendor scripts into the dev environment
gulp.task('build-vendor-scripts-dev', pipes.builtVendorScriptsDev);

// builds a complete dev environment
gulp.task('build-app-dev', pipes.builtAppDev);

// cleans and builds a complete dev environment
gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);

// concatenates, uglifies, and moves vendor scripts into the prod environment
gulp.task('build-vendor-scripts-prod', pipes.builtVendorScriptsProd);

// concatenates, uglifies, and moves app scripts and partials into the prod environment
gulp.task('build-app-scripts-prod', pipes.builtAppScriptsProd);

// builds a complete prod environment
gulp.task('build-app-prod', pipes.builtAppProd);

// cleans and builds a complete prod environment
gulp.task('clean-build-app-prod', ['clean-prod', 'unit-test'], pipes.builtAppProd);

// Unit-Testing
gulp.task('unit-test', pipes.testUnitTesting);

// clean, build, and watch live changes to the dev environment
gulp.task('watch-dev', ['clean-build-app-dev'], function() {

    gulp.src(paths.distDev).pipe(
        plugins.webserver({
            livereload: true,
            open: true,
            port: 8000,
            host: '0.0.0.0'
        })
    );

    // watch index
    plugins.watch(paths.index, function() {
        return pipes.builtIndexDev()
            .pipe(plugins.livereload());
    });

    // watch app scripts
    plugins.watch(paths.scripts, function() {
        return pipes.builtAppScriptsDev()
            .pipe(plugins.livereload());
    });

    // watch html partials
    plugins.watch(paths.partials, function() {
        return pipes.builtPartialsDev()
            .pipe(plugins.livereload());
    });

    // watch styles
    plugins.watch(paths.styles, function() {
        return pipes.builtStylesDev()
            .pipe(plugins.livereload());
    });

});

// default task builds for prod
gulp.task('default', ['clean-build-app-prod']);
