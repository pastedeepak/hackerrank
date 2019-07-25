(function() {
    'use strict';

    describe('abcbankApp.transaction module', function() {
        var TransactionsController, $controller, $scope;

        // Load the app containing the controller
        beforeEach(module('ui.router'));
        beforeEach(module('abcbankApp.transaction'));
	      beforeEach(inject(function(_$controller_, _$rootScope_,_$state_) {
	      $controller = _$controller_;
	      $scope = _$rootScope_.$new();
	      TransactionsController = $controller('TransactionsController', {
	           $scope: $scope,
             $state:_$state_
	      });
	 }));
        describe('TransactionsController', function() {
            it('Controller definition', function() {

                expect(TransactionsController).toBeDefined();
            });
            it('should have a save Transaction function', function() {
                expect(angular.isFunction(TransactionsController.saveTransaction)).toBe(true);
            });
        });

    });

})();
