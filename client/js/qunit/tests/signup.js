// create test bed
var injector = angular.injector(['ng', 'ngMock', 'signupApp']);

var init = {
  setup: function() {
    this.$scope = injector.get('$rootScope').$new();
  }
};

module('tests', init);

// test the 'match' directive
QUnit.test('match', function() {
  var html = '<form id="myform" name="signupController" ng-controller="signupController"><input id="password" ng-model="password" match="verification"></input><input id="verification" ng-model="verification" match="password"></input></form>';
  var $compile = injector.get('$compile');
  var element = $compile(html)(this.$scope);
  this.$scope.password = 'passw0rd';
  this.$scope.verification = 'passw0rd';
  this.$scope.$apply();
  ok(element.scope().signupController.$valid, '$valid is false');
  this.$scope.password = 'passw0rd';
  this.$scope.verification = 'passw0rd2';
  this.$scope.$apply();
  ok(!element.scope().signupController.$valid, '$valid is true when it should be false');
  delete this.$scope.foo;
});

// TODO make more and better tests