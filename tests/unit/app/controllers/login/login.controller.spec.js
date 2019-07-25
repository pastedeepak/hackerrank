(function() {
    'use strict';

    describe('abcbankApp.login module', function() {
        var LoginController;
        var authenticationService;

        // Load the app containing the controller
        beforeEach(module('ui.router'));
        beforeEach(module('abcbankApp.login'));
        beforeEach(module('abcbankApp.authenticationService'));

        beforeEach(inject(function($controller, _AuthenticationService_,_$state_) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            authenticationService = _AuthenticationService_;
            LoginController = $controller('LoginController', {
                'authenticationService': _AuthenticationService_,
                $state:_$state_
            });
        }));

        describe('LoginController', function() {

            it('Controller definition', function() {
                expect(LoginController).toBeDefined();
            });



            it('should have a login function', function() {
                expect(angular.isFunction(LoginController.login)).toBe(true);
            });

        });
    });

})();
