(function() {
    'use strict';

    // CONTROLLERS
    angular
        .module('abcbankApp.controllers', []);

    // SERVICES
    angular
        .module('abcbankApp.services', []);

    angular
        .module('abcbankApp', ['ui.router', 'ui.grid', 'abcbankApp.accountSummary', 'abcbankApp.transaction', 'abcbankApp.login'])
        .config(routeConfig);


    function routeConfig($stateProvider,$urlRouterProvider) {
       $urlRouterProvider.when("", "/login");
        // ROUTES
        // Please use State provoders for routing between login,accountSummary, transactions and search
        // define  $stateProvider(state) with url,templateUrl,controllers and controllerAs
    }

})();
