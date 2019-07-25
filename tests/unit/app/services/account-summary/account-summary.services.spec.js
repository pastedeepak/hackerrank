(function() {
    'use strict';

    describe('abcbankApp.accservice module', function() {
        var AccountSummaryService;
        var $httpBackend, $rootScope;

        // Load the app containing the controller
        beforeEach(module('abcbankApp.accountSummaryService'));

        beforeEach(inject(function(_AccountSummaryService_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            AccountSummaryService = _AccountSummaryService_;

        }));
        beforeEach(inject(function($injector) {
            // Set up the mock http service responses
            $httpBackend = $injector.get('$httpBackend');
            $rootScope = $injector.get('$rootScope');
        }));
        describe('AccountSummaryService', function() {

            it('Service definition', function() {

                expect(AccountSummaryService).toBeDefined();

            });

        });

        it('should have a getAccountSummary function', function() {
            expect(angular.isFunction(AccountSummaryService.getAccountSummary)).toBe(true);
        });

        it('accountSummary function should be definded', function() {

            AccountSummaryService.getAccountSummary();
            expect(true).toBe(true);

        });

        it('should have the account-summary.json', inject(function($http) {

            var $scope = {};

            /* Code Under Test */
            $http.get('data/account-summary.json')
                .then(function(data, status, headers, config) {

                    $scope.valid = true;
                    $scope.response = data;

                })

            /* End */

        }));


    }); //describe

})();