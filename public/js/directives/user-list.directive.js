/* global angular */
var app = angular.module('chalkboard');

app.directive('userList', function() {
    return {
        restrict: 'E',
        scope: {
            users: '='
        },
        templateUrl: 'views/directives/user-list.directive.html',
        controller: ['$scope', function($scope) {
            $scope.criteriaMatch = function(criteria) {
                return function(user) {
                    if (!criteria) return true;
                    criteria = criteria.toLowerCase();
                    return (
                        ((user.name.first + ' ' + user.name.last).toLowerCase().indexOf(criteria) !== -1) ||
                        (user.email ? user.email.toLowerCase().indexOf(criteria) !== -1 : false) ||
                        (user.username ? user.username.toLowerCase().indexOf(criteria) !== -1 : false)
                    );
                };
            };
        }]
        // css: main.css -> directives
    };
});