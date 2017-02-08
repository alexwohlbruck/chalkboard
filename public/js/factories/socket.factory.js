/* global angular, io */
var app = angular.module('chalkboard');

app.factory('ChatSocket', ['socketFactory', '$location', function(socketFactory, $location) {
    return socketFactory({
        ioSocket: io.connect($location.$$absUrl + '/chat')
    });
}]);

app.factory('NotificationsSocket', ['socketFactory', '$location', function(socketFactory, $location) {
    return socketFactory({
        ioSocket: io.connect($location.$$absUrl + '/notifications')
    });
}]);