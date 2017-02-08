/* global angular */
var app = angular.module('chalkboard');

app.directive('message', function() {
    return {
        restrict: 'E',
        scope: {
            message: "=",
            options: "="
        },
        templateUrl: '/views/directives/message.directive.html'
        // css: main.css -> directives
    };
});