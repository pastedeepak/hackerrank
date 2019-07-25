(function() {
    'use strict';

    describe('abcbankApp.accsummary module', function() {
        var AccountSummaryController;
        var accountSummaryService;

        // Load the app containing the controller
        beforeEach(module('ui.router'));

        beforeEach(module('abcbankApp.accountSummary'));
        beforeEach(module('abcbankApp.accountSummaryService'));

        beforeEach(inject(function($controller, _AccountSummaryService_,_$state_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            accountSummaryService = _AccountSummaryService_;
            AccountSummaryController = $controller('AccountSummaryController', {
                'accountSummaryService': _AccountSummaryService_,
                 $state: _$state_
            });
        }));

        describe('AccountSummaryController', function() {

            it('Controller definition', function() {
                expect(AccountSummaryController).toBeDefined();
            });



            it('should have a getAccountSummary function', function() {
                expect(angular.isFunction(AccountSummaryController.getAccountSummary)).toBe(true);
            });

        });
    });

})();
