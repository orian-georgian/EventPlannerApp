(function(angular){

    var module = angular.module('eventPlanner', ['ionic', 'events.controllers'])

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

    module.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
      $stateProvider
        .state('event', { url: "/events", templateUrl: "templates/events.html"})
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
      $urlRouterProvider.otherwise('/events');
    }]);

}).call(this, this.angular);