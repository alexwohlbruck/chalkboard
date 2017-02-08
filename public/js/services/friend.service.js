/* global angular */
var app = angular.module('chalkboard');

app.service('FriendService', ['$http', function($http) {
    this.getFriends = function() {
        return $http.get('/api/friends');
    };
    
    this.sendFriendRequest = function(userID) {
        return $http.post('/api/friends', {userID: userID});
    };
}]);