/* global angular */
var app = angular.module('chalkboard');

app.controller('ProfileCtrl', ['$scope', '$rootScope', 'UserService', '$stateParams', 'FriendService', 'AppMethods',
    function($scope, $rootScope, UserService, $stateParams, FriendService, AppMethods) {
        
    if ($stateParams.userID) {
        UserService.getUser($stateParams.userID)
            .then(function(response) {
                $scope.user = response.data;
            }, function(err) {
                AppMethods.toast({message: err.data.message || err.statusText});
            });
    } else {
        if (!$rootScope.authenticatedUser) {
            var getUserInterval = setInterval(function() {
                if ($rootScope.authenticatedUser) {
                    clearInterval(getUserInterval);
                    $scope.user = $rootScope.authenticatedUser;
                }
            }, 10);
        }
        $scope.user = $rootScope.authenticatedUser;
    }
    
    $scope.sendFriendRequest = function() {
        FriendService.sendFriendRequest($scope.user._id)
            .then(function(data) {
                console.log(data);
                alert('sent fiend reuqest');
            }, function(err) {
                console.log(err);
            });
    };
}]);