/* global angular */
var app = angular.module('chalkboard');

app.service('UserService', ['$http', function($http) {
    this.getUser = function(userID) {
        return $http.get('/api/users/' + userID);
    };
}]);