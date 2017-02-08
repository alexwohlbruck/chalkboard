/* global angular */
var app = angular.module('chalkboard');

app.controller('ClassroomsListCtrl', ['$scope', '$rootScope', 'ClassroomService', 'SchoolService', '$mdDialog', '$mdMedia', 'AppMethods',
    function($scope, $rootScope, ClassroomService, SchoolService, $mdDialog, $mdMedia, AppMethods) {
        
    $scope.openJoinClassroom = function(event) {
        var prompt = $mdDialog.prompt()
    		.title("Join a classroom")
    		.textContent("Enter the enrollment code provided by your teacher")
    		.placeholder("Enrollment code")
    		.ariaLabel("Join a classroom")
    		.targetEvent(event)
    		.clickOutsideToClose(true)
    		.ok("Join")
    		.cancel("Cancel");
    		
        $mdDialog.show(prompt)
            .then(function(enrollmentCode) {
                if (!enrollmentCode) { AppMethods.toast({message: "Enter a code"}); return $scope.openJoinClassroom(event); }
                return ClassroomService.joinClassroom(enrollmentCode);
            })
            .then(function(response) {
                $rootScope.classrooms.enrolled.push(response.data);
            }, function(err) {
                AppMethods.toast({message: err.data.message || err.statusText});
                $scope.openJoinClassroom(event);
            });
    };
    
    $scope.openCreateClassroom = function(event) {
        SchoolService.getMySchools().then(function(response) {
        console.log(response.data);
            return $mdDialog.show({
                templateUrl: 'views/partials/forms/create-classroom.partial.html',
                parent: angular.element(document.body),
                targetEvent: event,
                clickOutsideToClose: true,
                fullscreen: $mdMedia('xs'),
                locals: {schools: response.data},
                controller: ['$scope', '$mdDialog', '$state', 'schools', 'ClassroomService', function($scope, $mdDialog, $state, schools, ClassroomService) {
                    $scope.schools = schools;
                    $scope.teacherCode = {code: null};
                    
                    $scope.closeDialog = function() {
                        $mdDialog.hide();
                    };
                    
                    $scope.createBlocksArray = function(amount) {
                        var array = [], i = 1;
                        while (i <= amount) {
                            array.push(i++);
                        }
                        return array;
                    };
                    
                    $scope.createClassroom = function() {
                        ClassroomService.createClassroom($scope.classroom, $scope.teacherCode.code)
                            .then(function(classroom) {
                                $scope.closeDialog();
                                $state.go('classroom', {classroomID: classroom.data._id});
                            }, function(err) {
                                AppMethods.toast({message: err.data.message || err.statusText});
                            });
                    };
                    
                    $scope.selectOptions = {
                        blocks: [1,2,3,4,5,6,7,8],
                        ab: [null,'a','b']
                    };
                }]
            });
        });
        
        // ClassroomService.createClassroom(classroom, teacherCode);
        // AppMethods.toast({message: err.message || err.statusText});
    };
}]);