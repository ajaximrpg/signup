var app = angular.module('signupApp', ['ngRoute']);

// the router
app.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider
      .when('/signup', {
        templateUrl: '/signup',
        controller: 'signupController'
      })
      .when('/thanks', {
        templateUrl: '/signup/thanks',
        controller: 'thanksController'
      })
      .otherwise({
        redirectTo: '/signup'
      });
  }
]);

// the 'signup' page controller
app.controller('signupController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
  $scope.cancel = function() {
    alert('page canceled');
  };
  $scope.signup = function() {
    var user = {
      first: $scope.first,
      last: $scope.last,
      email: $scope.email,
      password: md5($scope.password),
      verification: md5($scope.verification)
    };
    $http.post("/user", user).success(function(data) {
      // user signed up, move to next page
      $location.path(data.location);
    }).error(function(data) {
      // server-side validation failed
      if (data.alreadySignedUp) {
        // invalidate email
        $scope.form.email.$setValidity('alreadySignedUp', false);
        var unreg = $scope.$watch('email', function() {
          if (user.email != $scope.email) {
            $scope.form.email.$setValidity('alreadySignedUp', true);
            unreg();
          }
        });
      }
    });
  };             
}]);

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
