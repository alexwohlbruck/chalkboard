/* global angular */
var app = angular.module('chalkboard');

app.controller('ClassroomCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', 'ClassroomService', 'AppMethods',
    function($scope, $rootScope, $stateParams, $filter, ClassroomService, AppMethods) {
        
    ClassroomService.getClassroom($stateParams.classroomID)
        .then(function(response) {
            $scope.classroom = response.data;
            $scope.classroom.students.find(function(o) { o.user.pinned = o.user._id == $rootScope.authenticatedUser._id; });
            $scope.studentsList = $scope.classroom.students.map(o => o.user);
            console.log($scope.classroom);
            $scope.jumbotronData = {
                title: $scope.classroom.name,
                subtitle: 
                    $filter('genderFormal')($scope.classroom.teacher.user.gender)
                    + ' '
                    + $scope.classroom.teacher.user.name.last
                    + ' - '
                    + $filter('ordinal')($scope.classroom.period.block)
                    + ' block'
                    + (!$scope.classroom.period.ab ? '' : ', ' + $scope.classroom.period.ab.toUpperCase() + ' day'),
                cover: $scope.classroom.cover,
                photo: $scope.classroom.teacher.user.photo
            };
        }, function(err) {
            AppMethods.toast({message: err.data.message || err.statusText});
        });
}]);