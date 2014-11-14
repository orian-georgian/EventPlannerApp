(function(angular){

    var module = angular.module('eventPlanner', ['ionic', 'events.models', 'events.controllers', 'events.services', 'ngCookies'])

    module.run(function($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      });
    });

    module.value('GOOGLE_API', 'https://www.googleapis.com/calendar/v3/');

    module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('event', { url: "/events", templateUrl: "templates/events.html", controller: 'AppCtrl'})
        .state('menu', {
          url: "/menu",
          abstract: true,
          templateUrl: "templates/menu.html",
          controller: 'AppCtrl'
        })
        .state('menu.wedding', {
          url: "/wedding",
          views: {
            'menuContent' :{
              templateUrl: "templates/wedding.html",
              controller: 'EventsCtrl'
            }
          }
        })
        .state('menu.invited', {
          url: "/invited",
          views: {
            'menuContent' :{
              templateUrl: "templates/invited.html",
              controller: 'InvitedCtrl'
            }
          }
        });
       /*.state('app', { url: "/app", abstract: true, templateUrl: "templates/events.html", controller: 'PlaylistsCtrl' })
        .state('app.search', { url: "/search", views: { 'menuContent' : { templateUrl: "templates/search.html" } } })
        .state('app.browse', { url: "/browse", views: { 'menuContent' : { templateUrl: "templates/browse.html" } } })
        .state('app.playlists', { 
          url: "/playlists",
            views: {
              'menuContent' : {
                templateUrl: "templates/events.html",
                controller: 'PlaylistsCtrl'
            }
          }
        })
        .state('app.single', {
          url: "/playlists/:playlistId",
          views: {
            'menuContent' :{
              templateUrl: "templates/playlist.html",
              controller: 'PlaylistCtrl'
            }
          }
        });*/
        // if none of the above states are matched, use this as the fallback
      /*$urlRouterProvider.otherwise('/events');
       googleLoginProvider.configure({
            clientId: '546633364756-54l9fd0ve8b179qp5dv2qpvvlbkq0uam.apps.googleusercontent.com',
            scopes: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/calendar']
        });
        $parseProvider.unwrapPromises(true);*/
    }]);

}).call(this, this.angular);