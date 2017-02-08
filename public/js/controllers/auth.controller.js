/* global angular */
var app = angular.module('chalkboard');

app.controller('AuthCtrl', ['$scope', '$rootScope', '$http', '$state', 'AuthService', 'tabIndex', 'AppMethods',
    function($scope, $rootScope, $http, $state, AuthService, tabIndex, AppMethods) {
    
    var googleColors = ['#4285f4', '#ea4335', '#fbbc05', '#34a853'];
    
    $scope.tabIndex = tabIndex;
    
    $scope.login = function() {
        AuthService.login($scope.loginForm);
    };
    
    $scope.register = function() {
        if ($scope.registerForm.gender) {
            if ($scope.registerForm.password == $scope.registerForm.confirm) {
                AuthService.register($scope.registerForm);
            } else {
                AuthService.failure(AppData.error.error.auth.register.passwordMismatch);
            }
        } else {
            AuthService.failure(AppData.error.error.auth.register.noGender);
        }
    };
    
    $scope.loginGoogle = function() {
        AuthService.loginGoogle();
    };
    
    $scope.googleColor = function() {
        // return '#4285f4';
        return googleColors[Math.floor(Math.random() * googleColors.length)];
    };
}]);