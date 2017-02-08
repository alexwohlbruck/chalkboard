/* global angular */
var app = angular.module('chalkboard');

app.directive('classroomsList', function() {
    return {
        restrict: 'E',
        scope: {
            classrooms: "="
        },
        templateUrl: '/views/directives/classroom-list.directive.html',
        controller: 'ClassroomsListCtrl'
        // css: main.css -> directives
    };
});