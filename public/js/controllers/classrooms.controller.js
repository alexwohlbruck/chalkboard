/* global angular */
var app = angular.module('chalkboard');

app.controller('ClassroomsCtrl', ['$scope', '$rootScope', 'ClassroomService', function($scope, $rootScope, ClassroomService) {
    ClassroomService.getClassrooms()
        .then(function(response) {
            $rootScope.classrooms = response.data;
        }, function(err) {
            $rootScope.toast({message: $rootScope.errors.classrooms.failedToLoad});
        });
}]);