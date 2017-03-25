/* global angular */
var app = angular.module('chalkboard');

app.directive('post', function() {
    return {
        restrict: 'E',
        scope: {
            post: "="
        },
        templateUrl: '/views/directives/post.directive.html',
    };
});