(function() {
    'use strict';

    describe('abcbankApp.authservice module', function() {
        var AuthenticationService;

        // Load the app containing the controller
        beforeEach(module('abcbankApp.authenticationService'));

        beforeEach(inject(function(_AuthenticationService_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            AuthenticationService = _AuthenticationService_;

        }));

        describe('AuthenticationService', function() {

            it('Service definition', function() {
                expect(AuthenticationService).toBeDefined();
            });


            it('should have a login function', function() {
                expect(angular.isFunction(AuthenticationService.Login)).toBe(true);
            });


        });
    });

})();