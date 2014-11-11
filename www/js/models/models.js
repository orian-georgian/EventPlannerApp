(function(){

	'use strict';

	var module = angular.module('events.models', []);

	module.factory('AuthenticationModel', function(){
		var authenticationModel = {
			isLoggedIn : false,
			authenticationToken : {}
		};
		return authenticationModel;
	});

}).call(this);