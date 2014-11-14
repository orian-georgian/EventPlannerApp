(function(angular){	

	var module = angular.module('events.services', []);

	module.service('AuthenticationService', function ($http, $q, $rootScope, $timeout, $cookieStore, AuthenticationModel){

		var deff = {},
			authModel = $cookieStore.get('login.state');

		this.login = function() {
			deff = $q.defer();
			doLogin();
			return deff.promise;
		};

		var doLogin = function() {
			
			var myParams = {
			    'clientid' : '285780208615-iech8k82l3qjb8q51d7kveog1qomaj4s.apps.googleusercontent.com',
			    'cookiepolicy' : 'single_host_origin',
			    'immediate': true,
			    'callback' : handleLogin,
			    'scope' : 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/plus.me'
			  };
			  gapi.auth.signIn(myParams);
		};

		var handleLogin = function(authResult) {
			gapi.client.oauth2.userinfo.get().execute(function (response){
				if (!response.code) {
					AuthenticationModel.isLoggedIn = true;
					AuthenticationModel.token = authResult.access_token;
					$cookieStore.put('login.state', AuthenticationModel);
					$rootScope.$apply(function() {
			          	deff.resolve(AuthenticationModel);
			        });
				}
			});
		};

	});

	module.service('InitializationService', function ($http, $q, $rootScope, $cookieStore, AuthenticationModel){

		var authModel = $cookieStore.get('login.state');

		function verifyAuthentication() {
			if (authModel) {
				$http({
						url : 'https://www.googleapis.com/oauth2/v1/tokeninfo', 
						method: 'POST',
						params : {access_token : authModel.token}
					})
					.success(function(data){
						console.log('validate', data);
					})
					.error(function(error){
						console.log('error', error);
					});
			}
		}

		this.initialize = function() {

			var apisToLoad = 3,
				deff = $q.defer();

			var loginCallback = function() {
				if (--apisToLoad === 0) {
					$rootScope.$apply(function(){
						deff.resolve($cookieStore);
					});
				}
			};

			var apiKey = 'AIzaSyDj-csmlxCNe9FcOzhJ_wsW-FziLd-cLhI';
            gapi.client.setApiKey(apiKey);

			gapi.client.load('oauth2', 'v2', loginCallback);
			gapi.client.load('calendar', 'v3', loginCallback);
			gapi.client.load('plus', 'v1', loginCallback);

			verifyAuthentication();

			return deff.promise;
		};
	});

}).call(this, this.angular);