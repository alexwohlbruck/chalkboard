/* global angular */
var app = angular.module('chalkboard');

app.factory('AppData', [function() {
    return {
        app: {
            name: "Chalkboard",
            isLoading: false
        },
        error: {
            generic: "An error occured, try again later",
            auth: {
                register: {
                    noGender: "Choose your gender",
                    passwordMismatch: "Passwords don't match!"
                },
                google: {
                    failure: "Google log in failed :("
                }
            },
            classrooms: {
                failedToLoad: "Failed to load your classrooms"
            },
            chat: {
                conversation: {
                    failedToOpen: "Couldn't load conversation"
                }
            }
        }
    };
}]);