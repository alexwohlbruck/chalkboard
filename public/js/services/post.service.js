/* global angular */
var app = angular.module('chalkboard');

app.service('PostService', ['$http', function($http) {
    this.createPost = function(data) {
        switch (data.type) {
            case 'announcement':
                return $http.post('/api/classrooms/'+data.classroom+'/posts', data);
            case 'assignment':
                return $http.post('/api/assignments', data);
        }
    };
}]);