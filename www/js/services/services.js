(function(angular){	

	var module = angular.module('events.services', []),
		mapper = this.ContactsMapper;

	module.factory('$localStorage', ['$window', '$cookieStore', function ($window, $cookieStore) {

		var hasLocalStorage = Boolean($window.localStorage),
            hasSessionStorage = Boolean($window.sessionStorage);

        function storeData(key, value) {
            if (hasLocalStorage) {
                $window.localStorage[key] = angular.toJson(value);
                return;
            }
            if (hasSessionStorage) {
                $window.sessionStorage[key] = angular.toJson(value);
                return;
            }
            $cookieStore.put(key, value);
        }

        function readData(key) {
            if (hasLocalStorage) {
                return angular.fromJson($window.localStorage[key]);
            }
            if (hasSessionStorage) {
                return angular.fromJson($window.sessionStorage[key]);
            }
            return $cookieStore.get(key);
        }

        function removeData(key) {
            if (hasLocalStorage) {
                if (angular.isFunction($window.localStorage.removeItem)) {
                    $window.localStorage.removeItem(key);
                    return;
                }
                delete $window.localStorage[key];
                return;
            }
            if (hasSessionStorage) {
                if (angular.isFunction($window.sessionStorage.removeItem)) {
                    $window.sessionStorage.removeItem(key);
                    return;
                }
                delete $window.sessionStorage[key];
                return;
            }
            $cookieStore.remove(key);
        }

		return {
			Set : storeData,
        	Get : readData,
        	Zap : removeData
		};
	}]);

	module.service('AuthenticationService', function ($http, $q, $state, $rootScope, $timeout, $localStorage, AuthenticationModel, WeddingService, CONSTANTS){

		var deff = {},
			requestToken = '',
			accessToken = '';

		$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

		this.login = function() {
			deff = $q.defer();
			var ref = window.open('https://accounts.google.com/o/oauth2/auth?client_id=' + CONSTANTS.CLIENT_ID + '&redirect_uri=http://localhost/callback&scope=https://www.googleapis.com/auth/urlshortener&approval_prompt=force&response_type=code&access_type=offline', '_blank', 'location=no');
	        ref.addEventListener('loadstart', function(event) { 
	            if((event.url).startsWith("http://localhost/callback")) {
	                requestToken = (event.url).split("code=")[1];
	                $http({method: "post", url: "https://accounts.google.com/o/oauth2/token", data: "client_id=" + CONSTANTS.CLIENT_ID + "&client_secret=" + CONSTANTS.CLIENT_SECRET + "&redirect_uri=http://localhost/callback" + "&grant_type=authorization_code" + "&code=" + requestToken })
	                    .success(function(data) {
	                        accessToken = data.access_token;
	                        $state.go('menu.wedding');
	                        AuthenticationModel.isLoggedIn = true;
							AuthenticationModel.token = data.access_token;
							$localStorage.Set('login.state', AuthenticationModel);
							$rootScope.$apply(function() {
					          	deff.resolve(AuthenticationModel);
					        });
	                    })
	                    .error(function(data, status) {
	                        alert("ERROR: " + data);
	                    });
	                ref.close();
	            }
	        });
	        return deff.promise;
		};

		if (typeof String.prototype.startsWith != 'function') {
			String.prototype.startsWith = function (str){
				return this.indexOf(str) == 0;
			};
		}

		/*this.login = function() {
			deff = $q.defer();
			doLogin();
			return deff.promise;
		};

		var doLogin = function() {
			
			var myParams = {
			    'clientid' : '285780208615-292q56s16pvvnnhfqjbecthstgtrqmvo.apps.googleusercontent.com',
			    'cookiepolicy' : 'single_host_origin',
			    'immediate': true,
			    'callback' : handleLogin,
			    'scope' : 'https://www.google.com/m8/feeds/ https://www.google.com/m8/feeds/user/ https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/plus.profile.emails.read https://www.googleapis.com/auth/plus.me https://www.googleapis.com/auth/userinfo.email'
			  };
			  gapi.auth.authorize(myParams);
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
		};*/

		this.logout = function(){
			var authModel = $localStorage.Get('login.state');
			deff = $q.defer();
			$http({
				url : 'https://accounts.google.com/o/oauth2/revoke',
				method : 'GET',
				params : {
					token : authModel.token
				}
			}).success(function(data){
				deff.resolve(data);
				$state.go('event');
				AuthenticationModel.isLoggedIn = false;
				$localStorage.Zap('login.state');
			}).error(function(){
				deff.reject(data);
			});
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

		this.sendAuthUserInfo = function(userData) {
			var result = $q.defer();

			$http({
				url : '',
				method: 'POST',
				data : userData
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

	module.service('InvitedService', function ($http, $q, $cookieStore, AuthenticationModel) {

		var contactsMapper = new mapper();
		var authModel = _.isUndefined($cookieStore.get('login.state')) ? AuthenticationModel : $cookieStore.get('login.state');

		this.getGoogleContacts = function() {
			var result = $q.defer();

			$http({
				url : 'https://www.google.com/m8/feeds/contacts/default/full?max-results=1000',
				method: 'GET',
		        params: {
		          access_token : authModel.token,
		          alt: 'json'
		        }
			})
			.success(function(data){
				result.resolve(contactsMapper.mapContacts(data.feed.entry));
			})
			.error(function(error){
				result.reject(error);
			});

			return result.promise;
		};

		this.sendSelectedContacts = function(contacts) {
			var result = $q.defer();
			$http({
				url : '',
				method : 'POST',
				data : contactsMapper.unmapContacts(contacts)
			}).success(function(data){
				result.resolve(data);
			}).error(function(error){
				result.reject(error);
			});
			return result.promise;
		};

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
		};

	});

}).call(this, this.angular);