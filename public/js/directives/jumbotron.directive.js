/* global angular */
var app = angular.module('chalkboard');

app.directive('jumbotron', function() {
    return {
        restrict: 'E',
        scope: {
            data: "=",
            height: "="
        },
        templateUrl: 'views/directives/jumbotron.directive.html',
        controller: ['$scope', '$mdMedia', function($scope, $mdMedia) {
            $scope.$mdMedia = $mdMedia;
        }]
        // css: main.css -> directives
    };
});