/* global angular */
var app = angular.module('chalkboard');

app.filter('ordinal', function() {
	return function(number) {
		var s = ["th","st","nd","rd"],
		v = number % 100;
		return number + (s[(v-20)%10]||s[v]||s[0]);
	};
});

app.filter('genderFormal', function() {
	return function(gender) {
		return gender == 'male' ? 'Mr.' : 'Ms.';
	};
});

app.filter('capitalize', function() {
	return function(input) {
		if (input != null) input = input.toLowerCase();
		return input.substring(0,1).toUpperCase() + input.substring(1);
	};
});

app.filter('enumerate', function() {
	return function(items) {
		switch (items.length) {
			case 1:
				return items[0];
			case 2:
				return items[0] + ' and ' + items[1];
			default: 
				return items.slice(0, 2).join(', ') + ' and ' + (items.length - 2) + ' other' + ((items.length - 2 != 1) ? 's' : '');
		}
	};
})