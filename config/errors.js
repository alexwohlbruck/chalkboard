module.exports = {
    generic: "An error occurred, try again later",
    notFound: "That document doesn't exist",
    unauthorized: "You don't have permission to do that",
    unauthenticated: "You need to log in first",
    invalidCode: "That code is invalid",
    auth: {
        login: {
            noUser: "That user doesn't exist",
            invalidPassword: "That password is incorrect",
            googleAccount: "That account uses Google login"
        },
        register: {
            usernameExists: "That username is already being used",
            emailExists: "That email is already being used"
        }
    },
    classroom: {
        alreadyEnrolled: "You are already enrolled in that class"
    },
    chat: {
        create: {
            insufficientParticipants: "You need at least one other participant to start a chat",
            alreadyExists: "That conversation already exists"
        }
    },
    friends: {
        sendFriendRequest: {
            requestSelf: "You can't friend yourself"
        }
    },
    validate: {
        email: "That email is invalid",
        gender: "Choose a gender",
        alphanumeric: function(type) { return type + " can only contain letters and numbers" }
    }
};