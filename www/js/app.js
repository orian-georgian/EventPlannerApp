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
        $urlRouterProvider.otherwise('/events');
    }]);

}).call(this, this.angular);