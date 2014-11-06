angular.module('events.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.loginModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/register.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.registerModal = modal;
  });

  $ionicModal.fromTemplateUrl('templates/weddingPlan.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.weddingPlanModal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.loginModal.hide();
  };

  $scope.closeRegister = function() {
    $scope.registerModal.hide();
  };

  $scope.closeWeddingPlan = function() {
    $scope.weddingPlanModal.hide();
  };

  $scope.register = function() {
    $scope.registerModal.show();
    $scope.closeLogin();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.loginModal.show();
    $scope.closeRegister();
  };

  $scope.weddingPlan = function() {
    $scope.weddingPlanModal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };

  $scope.weddingPlan.budget = 40000;
})

.controller('EventsCtrl', function($scope, $ionicNavBarDelegate) {

});
