/* global angular */
var app = angular.module('chalkboard');

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
    
    $urlRouterProvider.otherwise('/');
    
    var routes = [
        {
            name: 'home',
            url: '/',
            templateUrl: 'views/home.view.html',
            restricted: false,
            data: {
                title: 'Home',
                icon: null,
                hideToolbars: true
            }
        },
        {
            name: 'profile',
            url: '/profile/:userID',
            templateUrl: 'views/profile.view.html',
            controller: 'ProfileCtrl',
            restricted: true,
            data: {
                title: 'Profile',
                icon: 'face'
            }
        },
        {
            name: 'classrooms',
            url: '/classrooms',
            templateUrl: 'views/classrooms.view.html',
            controller: 'ClassroomsCtrl',
            restricted: true,
            data: {
                title: 'Classrooms',
                icon: 'book'
            }
        },
        {
            name: 'classroom',
            url: '/classrooms/:classroomID',
            templateUrl: 'views/classroom.view.html',
            controller: 'ClassroomCtrl',
            restricted: true
        },
        {
            name: 'chat',
            url: '/chat',
            restricted: true,
            templateUrl: 'views/chat.view.html',
            controller: 'ChatCtrl',
            data: {
                title: 'Chat',
                icon: 'chat'
            }
        }
    ];
    
    for (var i = 0; i < routes.length; i++) {
        $stateProvider.state(routes[i]);
    }
    
}]);