/* global angular */
var app = angular.module('chalkboard');

app.service('AuthService', ['$rootScope', '$http', '$state', '$window', '$mdDialog', 'AppData', 'AppMethods', 'ChatSocket',
    function($rootScope, $http, $state, $window, $mdDialog, AppData, AppMethods, ChatSocket) {
        
    var that = this;
    var oauthPopup;
    
    this.login = function(formData) {
        var promise = $http.post('/api/users/auth/login', formData);
        AppData.app.isLoading = true;
        
        promise.success(function(data) {
            that.success(data.user);
            AppData.app.isLoading = false;
        });
        promise.error(function(err) {
            that.failure(err.message);
            AppData.app.isLoading = false;
        });
        
        return promise;
    };
    
    this.register = function(formData) {
        var promise = $http.post('/api/users/auth/register', formData);
        AppData.app.isLoading = true;
        
        promise.success(function(data) {
            that.success(data.user);
            AppData.app.isLoading = false;
        });
        promise.error(function(err) {
            that.failure(err.message);
            AppData.app.isLoading = false;
        });
        
        return promise;
    };

    this.loginGoogle = function() {
        var url = $window.location.origin + '/api/users/auth/google',
            width = 500,
            height = 600,
            top = (window.outerHeight - height) / 2,
            left = (window.outerWidth - width) / 2;
            
        oauthPopup = $window.open(url, 'google_login', 'width=' + width + ',height=' + height + ',scrollbars = 0, top=' + top + ',left=' + left);
        
        // Fallback if popup window can't find callback function in parent
        window.addEventListener('message', function(event) {
            if (event.origin == window.origin) {
                event.data.status == 'success' ? that.success(event.data.user) : that.failure(event.data.message);
            } else {
                return; 
            } 
        }); 
        
        // Fallback if window.postMessage is not avaibable in the browser api
        // Consider removing this, all browsers have support for postMessage
        // https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
        /*var checkWindow = setInterval(function() {
            if (!oauthPopup.closed && oauthPopup.document.URL.indexOf('api/users/auth/google/success') !== -1) {
                clearInterval(checkWindow);
                setTimeout(function() {
                    if (!$rootScope.authenticatedUser) {
                        if (!oauthPopup.closed) {
                            that.closeOAuth();
                        }
                        that.getUser()
                            .success(function(data) {
                                that.success(data.user);
                            })
                            .error(function(err) {
                                that.failure(err.message);
                            });
                    }
                }, 10);
            }
        }, 100);*/
    };
    
    this.closeOAuth = function() {
        oauthPopup.close();
    };
    
    this.getUser = function() {
        return $http.get('/api/users/me');
    };
    
    this.setUser = function() {
        var promise = that.getUser();
    		promise.then(function(response) {
    		    if (response.status == 200) {
    		      //  ChatSocket.emit('auth:login', response.data.user);
    			    $rootScope.authenticatedUser = response.data.user;
    		    } else {
    		      //  ChatSocket.emit('auth:logout');
    		        $rootScope.authenticatedUser = null;
    		    }
    		}, function(error) {
    		  //  ChatSocket.emit('auth:logout');
    			$rootScope.authenticatedUser = null;
    		});
        return promise;
    };
    
    this.updateUser = function(data) {
        var promise = $http.put('/api/users/me', data);
        return promise;
    };
    
    this.success = function(user) {
        $mdDialog.hide();
    // 	ChatSocket.emit('auth:login', user);
        $rootScope.authenticatedUser = user;
        $state.go('profile');
    };
    
    this.failure = function(message) {
        AppMethods.toast({message: message});
    };
    
    this.logout = function() {
        var promise = $http.get('/api/users/auth/logout');
        
        promise.then(function(data) {
            $rootScope.authenticatedUser = null;
            $state.go('home');
        }, function(err) {
            that.failure(err.message);
        });
        
        return promise;
    };
    
    this.isLoggedIn = function() {
        return $rootScope.authenticatedUser ? true : false;
    };
    
    this.openAuthDialog = function(event, type, index) {
        type = type || 'login';
        
        $mdDialog.show({
            controller: 'AuthCtrl',
            templateUrl: 'views/partials/forms/auth.partial.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: true,
            fullscreen: false,
            locals: {
                tabIndex: (type == 'register' ? 1 : 0)
            }
        });
    };
}]);