/* global angular */
var app = angular.module('chalkboard');

app.controller('OnboardingCtrl', ['$scope', '$rootScope', 'AuthService', '$mdMedia', '$mdDialog', 'AppMethods',
    function($scope, $rootScope, AuthService, $mdMedia, $mdDialog, AppMethods) {
        
    $scope.$mdMedia = $mdMedia;
    $scope.tabIndex = 0;
    $scope.tabs = [
        {
            name: "Welcome",
            color: '#1b277c',
            title: "Welcome to The Park!",
            text: "Here would be a description of something, idk I'm not creative",
            textColor: 'white',
            imageUrl: 'https://i.imgur.com/ddtjamt.png'
        },
        {
            name: "Choose role",
            color: '#6734ba',
            templateUrl: 'views/partials/onboarding/choose-role.partial.html',
            imageUrl: 'http://i.imgur.com/XlBJmtV.png'
        }
    ];
    $scope.finishOnboarding = function(newRole, code) {
        AuthService.updateUser({properties: {'account.role': newRole}, code: code})
            .then(function(response) {
                $rootScope.authenticatedUser = response.data.user;
                $mdDialog.hide();
            }, function(err) {
                AppMethods.toast({message: err.data.message || err.statusText});
            });
    };
}]);