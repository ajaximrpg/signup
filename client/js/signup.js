var app = angular.module('signupApp', []);

// the controller
app.controller('signupController', function ($scope, $http) {
  $scope.signup = function() {
    var data = {
      first: $scope.first,
      last: $scope.last,
      email: $scope.email,
      password: md5($scope.password),
      verification: md5($scope.verification)
    };
    $http.post("/user", data).success(function(data, status) {
      alert('do something interesting');
    });
  };             
});

// match password and verification
app.directive('match', [function () {
  return {
    require: 'ngModel',
    link: function (scope, elem, attrs, ctrl) {
      
      scope.$watch('['+attrs.ngModel+', '+attrs.match+']', function(value){
        ctrl.$setValidity('match', value[0] === value[1]);
      }, true);
    }
  };
}]);
