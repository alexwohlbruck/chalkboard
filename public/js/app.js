/* global angular, hljs */
var app = angular.module('chalkboard', [
    'ui.router', 'ngMaterial', 'ngAnimate', 'btford.socket-io', 'angularMoment', 'luegg.directives'
]);

app.config(['$mdThemingProvider', '$provide', function($mdThemingProvider) {
	$mdThemingProvider
		.theme('default')
		.primaryPalette('blue')
		.accentPalette('amber');
		
	$mdThemingProvider.enableBrowserColor({
        hue: '500'
    });
}]);

app.run(['$rootScope', '$location', 'AuthService', '$mdToast', '$window', '$state', '$mdMedia', 'AppData', 'AppMethods',
	function ($rootScope, $location, AuthService, $mdToast, $window, $state, $mdMedia, AppData, AppMethods) {
		
	$window.ga('create', 'UA-88600627-1', 'auto'); // Start Google Analytics
	$window.name = 'the-park-main-window';
	$rootScope.authenticatedUser = undefined;
	
	$rootScope.methods = AppMethods;
	$rootScope.$state = $state;
    $rootScope.$mdMedia = $mdMedia;
    $rootScope.AuthService = AuthService;
    $rootScope.AppData = AppData;
		
	$rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
	    $window.ga('send', 'pageview', $location.path());
	    
	    // Grab user data and check against restricted routes
		var checkNextRoute = function() {
			if ($rootScope.authenticatedUser === undefined) {
				AuthService.setUser()
					.then(function() {
						checkNextRoute();
					}, function() {
						if (toState.restricted) {
							$state.go('home');
						}
					});
			} else if (toState.restricted && !AuthService.isLoggedIn()) {
				$state.go('home');
			} else {
				// Everything is good, do more stuff here
				// $rootScope.authenticatedUser ?
				// AppMethods.other.checkNewUser($rootScope.authenticatedUser.createdAt) :
				// null;
			}
		};
		
		checkNextRoute();
	});
	
	$window.oauth = {
		finish: function(state, user) {
			// After OAuth has completed, popup window calls this function to return data
			$rootScope.$apply(function() {
				AuthService.closeOAuth();
				switch(state) {
					case 'success':
						AuthService.success(user);
						break;
					case 'failure':
						AuthService.failure(AppData.error.error.auth.google.failure);
						break;
				}
			});
		}
	};
}]);;
