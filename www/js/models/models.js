(function(){

	'use strict';

	var module = angular.module('events.models', []);

	module.factory('AuthenticationModel', function(){
		var authenticationModel = {
			isLoggedIn : false,
			token : null,
			email : null
		};
		return authenticationModel;
	});

}).call(this);