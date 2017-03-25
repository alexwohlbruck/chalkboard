/* global angular */
var app = angular.module('chalkboard');

app.controller('ChatCtrl', ['$scope', '$rootScope', 'ChatService', 'ChatSocket', '$mdDialog', '$mdMedia', 'FriendService', '$state', 'AppMethods',
    function($scope, $rootScope, ChatService, ChatSocket, $mdDialog, $mdMedia, FriendService, $state, AppMethods) {
        
    ChatService.getConversations()
        .then(function(response) {
            $scope.conversations = response.data;
            
            $scope.conversations.forEach(function(conversation, i) {
                $scope.conversations[i] = generateConvesationNames(conversation);
            });
            
            console.log($scope.conversations);
        });
        
    function generateConvesationNames(conversation) {
        if (conversation.name) return conversation;
        
        // Remove authenticated user from participants list
        conversation.names = conversation.participants.filter(function(participant) {
            return participant._id != $rootScope.authenticatedUser._id;
        });
        // Convert pariticpants (user) list to list of names only
        conversation.names = conversation.names.map(function(participant) {
            return conversation.names.length == 1 ? participant.name.first + ' ' + participant.name.last : participant.name.first;
        });
        
        return conversation;
    }
    
    $scope.openConversation = function(index) {
        ChatService.getConversation($scope.conversations[index]._id)
            .then(function(response) {
                
                $scope.selectedConversation = response.data;
                $scope.selectedConversation.index = index;
                ChatSocket.emit('conversation:join', $scope.conversations[index]._id);
                
                $state.current.data.menuOptions[$state.current.name] = [
                    {
                        text: 'People',
                        action: function() {
                            $scope.openPeople();
                        }
                    }
                ];
                
                console.log($state.current.data.menuOptions)
                
            }, function() {
                AppMethods.toast({message: $rootScope.errors.chat.conversation.failedtoOpen});
            });
    };
    
    $scope.hideConversation = function() {
        $scope.selectedConversation = null;
    };
    
    $scope.openPeople = function() {
        alert('opening people list');
    };
    
    $scope.sendMessage = function() {
        if ($scope.newMessage) {
            var message = $scope.newMessage;
                message.conversation = $scope.selectedConversation._id;
            ChatSocket.emit('message:send', message);
            $scope.newMessage = null;
        }
    };
    
    $scope.openCreateConversation = function() {
        $mdDialog.show({
            controller: ['$scope', '$mdDialog', function($scope, $mdDialog) {
                $scope.participants = [];
                
                FriendService.getFriends().then(function(response) {
                    $scope.friends = response.data;
                });
                
                $scope.getMatches = function(searchText) {
                    return $scope.friends.filter(function(user) {
                        if (!searchText) return true;
                        searchText = searchText.toLowerCase();
                        return (
                            ((user.name.first + ' ' + user.name.last).toLowerCase().indexOf(searchText) !== -1) ||
                            (user.email ? user.email.toLowerCase().indexOf(searchText) !== -1 : false) ||
                            (user.username ? user.username.toLowerCase().indexOf(searchText) !== -1 : false)
                        );
                    });
                };
                
                $scope.createConversation = function() {
                    var participantIDs = $scope.participants.map(o => o._id);
                    
                    ChatService.createConversation(participantIDs)
                        .then(function(response) {
                            $mdDialog.hide(response.data);
                        }, function(err) {
                            console.log(err);
                            $rootScope.toast({message: err.message || err.statusText});
                        });
                };
                
                $scope.closeDialog = function() {
                    $mdDialog.hide();
                };
            }],
            templateUrl: 'views/partials/forms/create-conversation.partial.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: $mdMedia('gt-sm')
        })
        .then(function(conversation) {
            if (conversation) {
                $scope.conversations.push(generateConvesationNames(conversation));
            }
        });
    };
    
    ChatSocket.on('message:send', function(message) {
        if (!message.createdAt) message.createdAt = new Date();
        $scope.selectedConversation.messages.push(message);
        $scope.selectedConversation.index = 0;
        $scope.conversations[$scope.selectedConversation.index].preview = message;
    });
}]);