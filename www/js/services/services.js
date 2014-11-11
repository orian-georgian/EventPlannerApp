(function(angular){	

	var module = angular.module('events.services', []);

	module.service('AuthenticationService', function ($q, $rootScope, $timeout, AuthenticationModel){

		var authenticationToken = {},
			deff = {};

		this.login = function(initialLogin) {
			deff = $q.defer();
			doLogin(initialLogin);
			return deff.promise;
		};

		var doLogin = function(mode) {
			var params = {
				client_id: '285780208615-iech8k82l3qjb8q51d7kveog1qomaj4s.apps.googleusercontent.com',
				scope: ['https://www.googleapis.com/auth/plus.me', 'https://www.googleapis.com/auth/userinfo.email'],
				immediate: mode
			};
			gapi.auth.authorize(params, handleLogin);
		};

		var handleLogin = function() {
			gapi.client.oauth2.userinfo.get().execute(function (response){
				console.log('response', response);
				if (!response.code) {
					authenticationToken = gapi.auth.getToken();
					authenticationToken.access_token = authenticationToken.id_token;
					AuthenticationModel.isLoggedIn = true;
					AuthenticationModel.authenticationToken = authenticationToken;
					$rootScope.$apply(function(){
						deff.resolve(AuthenticationModel);
					});
				}
			});
		};

	});

	module.service('InitializationService', function ($q, $rootScope){
		this.initialize = function() {
			var apisToLoad = 2,
				deff = $q.defer();

			var loginCallback = function() {
				if (--apisToLoad === 0) {
					$rootScope.$apply(function(){
						deff.resolve();
					});
				}
			};

			gapi.client.load('oauth2', 'v2', loginCallback);
			gapi.client.load('calendar', 'v3', loginCallback);

			return deff.promise;
		};
	});

}).call(this, this.angular);