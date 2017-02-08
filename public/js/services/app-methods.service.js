/* global angular */
var app = angular.module('chalkboard');

app.service('AppMethods', ['$mdSidenav', '$mdToast', '$mdDialog', '$mdMedia', '$rootScope',
    function($mdSidenav, $mdToast, $mdDialog, $mdMedia, $rootScope) {
    
    var that = this;
    
    this.sidenav = {
        toggle: function(id, isOpen) {
            if (!!isOpen) {
                $mdSidenav(id).open();
            } else {
                if (!isOpen) {
                    $mdSidenav(id).close();
                } else {
                    $mdSidenav(id).toggle();
                }
            }
        }
    };
    
    this.toast = function(options) {
        return $mdToast.show(
            $mdToast.simple()
                .textContent(options.message || "")
                .action(options.action)
                .highlightAction(options.highlightAction || true)
                .highlightClass(options.highlightClass)
                .capsule(options.rounded || false)
                .theme(options.theme)
                .toastClass(options.toastClass)
                .position(options.position || "bottom left")
                .hideDelay(options.delay || 5000)
        );
    };
    
    this.other = {
        checkNewUser: function(createdAt) {
            var userCreatedAt = new Date(createdAt || $rootScope.user.createdAt);
            var today = new Date();
            if (today.getTime() < userCreatedAt.getTime() + (60 * 1000)) that.other.openOnboarding();
        },
        openOnboarding: function() {
            return $mdDialog.show({
                controller: 'OnboardingCtrl',
                templateUrl: 'views/partials/onboarding/onboarding.partial.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                fullscreen: !$mdMedia('gt-sm')
            });
        }
    };
}]);