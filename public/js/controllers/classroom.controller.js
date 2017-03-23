/* global angular */
var app = angular.module('chalkboard');

app.controller('ClassroomCtrl', ['$scope', '$rootScope', '$stateParams', '$filter', 'ClassroomService', 'AppMethods', '$mdDialog', '$mdMedia', 'PostService',
    function($scope, $rootScope, $stateParams, $filter, ClassroomService, AppMethods, $mdDialog, $mdMedia, PostService) {
        
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
        
    $scope.createPost = function(ev, type) {
        $mdDialog.show({
            controller: function($scope) {
                $scope.ui = {};
                $scope.post = {
                    type: type
                };
                switch (type) {
                    case 'announcement':
                        $scope.ui.icon = 'announcement';
                        break;
                    case 'assignment':
                        $scope.ui.icon = 'assignment';
                        break;
                    case 'question':
                        $scope.ui.icon = 'live_help';
                        break;
                }
                $scope.closeDialog = function(data) {
                    $mdDialog.hide(data);
                };
            },
            templateUrl: '/views/partials/forms/post.partial.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: $mdMedia('xs')
        })
        .then(function(post) {
            PostService.createPost({
                classroom: $stateParams.classroomID,
                type: type,
                text: post.text
            }).then(function(response) {
                $scope.classroom.posts.unshift(response.data);
            });
        });
    };
}]);