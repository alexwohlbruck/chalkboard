/* global angular */
var app = angular.module('chalkboard');

app.directive('pageIndicator', function() {
    return {
        restrict: 'E',
        scope: {
            index: "=",
            pages: "=",
            color: "@",
            controls: "="
        },
        templateUrl: 'views/directives/page-indicator.directive.html',
        link: function($scope) {
            $scope.pageNext = function() {
                $scope.index <= $scope.pages.length - 1 ? $scope.index++ : null;
            };
            
            $scope.pageBack = function() {
                $scope.index >= 1 ? $scope.index-- : null;
            };
            
            $scope.goToPage = function(i) {
                $scope.index = i;
            }
        }
        // css: main.css -> directives
    };
});