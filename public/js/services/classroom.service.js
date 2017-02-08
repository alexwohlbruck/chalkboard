/* global angular */
var app = angular.module('chalkboard');

app.service('ClassroomService', ['$http', function($http) {
    this.getClassroom = function(classroomID) {
        return $http.get('/api/classrooms/' + classroomID);
    };
    
    this.getClassrooms = function() {
        return $http.get('/api/classrooms');
    };
    
    this.joinClassroom = function(enrollmentCode) {
        return $http.post('/api/classrooms/students', {enrollmentCode: enrollmentCode});
    };
    
    this.createClassroom = function(classroom, teacherCode) {
        return $http.post('/api/classrooms', {classroom: classroom, teacherCode: teacherCode});
    };
    
    /*this.updateClassroom = function(data) {
        return $http.patch('/api/classrooms', {data: data});
    };*/
}]);