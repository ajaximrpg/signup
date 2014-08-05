// create test bed
var injector = angular.injector(['ng', 'signupApp']);

var init = {
  setup: function() {
    this.$scope = injector.get('$rootScope').$new();
  }
};

module('tests', init);

// this test passes but it doesn't test the controller
QUnit.test('match', function() {
  var html = '<div><input id="password" ng-model="password" match="verification"></input><input id="verification" ng-model="verification" match="password"></input></div>';
  var $compile = injector.get('$compile');
  var element = $compile(html)(this.$scope);
  this.$scope.password = 'passw0rd';
  this.$scope.verification = 'passw0rd';
  this.$scope.$apply();
  equal(element.$valid);
  delete this.$scope.foo;
});

// TODO make more and better tests