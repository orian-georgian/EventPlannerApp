(function(angular){	

	var module = angular.module('events.services', []),
		mapper = this.InvitedMapper;

	module.service('AuthenticationService', function ($http, $q, $location, $rootScope, $timeout, $cookieStore, AuthenticationModel){

		var deff = {},
			authModel = $cookieStore.get('login.state');

		this.login = function() {
			deff = $q.defer();
			doLogin();
			return deff.promise;
		};

		var doLogin = function() {
			
			var myParams = {
			    'clientid' : '285780208615-asn44qdasii9ivcs91sc2i6nm0mmjad5.apps.googleusercontent.com',
			    'cookiepolicy' : 'single_host_origin',
			    'immediate': true,
			    'callback' : handleLogin,
			    'scope' : 'https://apps-apis.google.com/a/feeds/groups/ https://apps-apis.google.com/a/feeds/alias/ https://apps-apis.google.com/a/feeds/user/ https://www.google.com/m8/feeds/ https://www.google.com/m8/feeds/user/ https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/plus.me'
			  };
			  gapi.auth.signIn(myParams);
		};

		var handleLogin = function(authResult) {
			gapi.client.oauth2.userinfo.get().execute(function (response){
				if (!response.code) {
					AuthenticationModel.isLoggedIn = true;
					AuthenticationModel.token = authResult.access_token;
					AuthenticationModel.email = response.email;
					$cookieStore.put('login.state', AuthenticationModel);
					$rootScope.$apply(function() {
			          	deff.resolve(AuthenticationModel);
			        });
				}
			});
		};

		this.logout = function(){
			deff = $q.defer();
			gapi.auth.signOut();
			$location.path('/events');
			AuthenticationModel.isLoggedIn = false;
			$cookieStore.remove('login.state');
			return deff.promise;
		};

	});

	module.service('InitializationService', function ($http, $q, $rootScope, AuthenticationModel){
		this.initialize = function() {
			var apisToLoad = 3,
				deff = $q.defer();

			var loginCallback = function() {
				if (--apisToLoad === 0) {
					$rootScope.$apply(function(){
						deff.resolve();
					});
				}
			};

			var apiKey = 'AIzaSyDj-csmlxCNe9FcOzhJ_wsW-FziLd-cLhI';
            gapi.client.setApiKey(apiKey);

			gapi.client.load('oauth2', 'v2', loginCallback);
			gapi.client.load('calendar', 'v3', loginCallback);
			gapi.client.load('plus', 'v1', loginCallback);

			return deff.promise;
		};
	});


	module.service('WeddingService', function ($http, $q) {

		this.makeAWish = function(weddingPlan) {
			var result = $q.defer();

			$http({
				url : '',
				method: 'POST',
				data : weddingPlan
			})
			.success(function(data){
				result.resolve(data);
			})
			.error(function(error){
				result.reject(error);
			});

			return result.promise;
		};

	});

	module.service('InvitedService', function ($http, $q, $cookieStore) {

		var invitedMapper = new mapper();
		var authModel = $cookieStore.get('login.state');

		this.getGoogleContacts = function() {
			var result = $q.defer();

			$http({
				url : 'https://www.google.com/m8/feeds/contacts/' + authModel.email + '/full?max-results=1000',
				method: 'GET',
		        params: {
		          access_token : authModel.token,
		          alt: 'json'
		        }
			})
			.success(function(data){
				result.resolve(invitedMapper.MapInvited(data.feed.entry));
			})
			.error(function(error){
				result.reject(error);
			});

			return result.promise;
		};

		function doThat(data){
			console.log(data);
		}

		this.removeContact = function(contactId) {
			var result = $q.defer();

			/*$http({
				url : 'https://www.google.com/m8/feeds/contacts/default/full/' + contactId,
				method: 'DELETE',
				headers: {
					'If-Match': '*'
				},
		        params: {
		          access_token : authModel.token,
		          alt: 'json'
		        }
			})
			.success(function(data){
				result.resolve('bla',data);
			})
			.error(function(error){
				result.reject(error);
			});*/

			gapi.client.request({
					path: '/m8/feeds/contacts/' + authModel.email + '/full/' + contactId,
					method: 'POST',
					params: {
						access_token : authModel.token,
		          		alt: 'json'
					},
					headers: {
						'X-HTTP-Method-Override': 'DELETE',
						'If-Match': '*'
					},
					callback: doThat
				});

			return result.promise;
		};

	});

}).call(this, this.angular);