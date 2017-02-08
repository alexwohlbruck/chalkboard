/* global angular */
var app = angular.module('chalkboard');

app.service('ChatService', ['$http', function($http) {
    this.getConversations = function() {
        return $http.get('/api/chat/conversations');
    };
    
    this.getConversation = function(conversationID) {
        return $http.get('/api/chat/conversations/' + conversationID);
    };
    
    this.createConversation = function(participantIDs) {
        return $http.post('/api/chat/conversations', {participants: participantIDs});
    };
}]);