/* global angular */
var app = angular.module('chalkboard');

app.service('SchoolService', ['$http', function($http) {
    this.getMySchools = function() {
        return $http.get('/api/schools/me');
    };
}]);