/* global angular */
var app = angular.module('chalkboard');

app.directive('avatar', function() {
    return {
        restrict: 'E',
        scope: {
            photo: "=",
            size: "@"
        },
        template: '<img ng-src="{{photo}}" class="md-whiteframe-4dp {{size}}">',
        // css: main.css -> directives
    };
});