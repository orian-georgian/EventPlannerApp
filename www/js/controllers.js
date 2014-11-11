(function(angular){

    'use strict';

    var DataAdapter = new this.DataAdapter(),
        DataModel = this.DataModel;

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

    .controller('EventsCtrl', function($scope) {

    })

    .controller('InvitedCtrl', function($scope, $ionicModal, $ionicPopup) {
        $scope.invitedPeople = DataAdapter.GetInvited();

        $ionicModal.fromTemplateUrl('templates/newInvited.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.invitedModal = modal;
        });

        function emptyInputs() {
          $scope.invitedPerson = {
            firstName : null,
            lastName : null,
            phoneNumber : null,
            mailAddress : null,
            confirmationDate : null,
            man: true
          };
        }

        $scope.isHidden = false;

        $scope.showInvited = function() {
          $scope.isHidden = true;
          $scope.invitedPerson = {
            man : true
          };
          $scope.invitedModal.show();
        };

        $scope.closeInvited = function() {
          $scope.invitedModal.hide();
          emptyInputs();
        };

        $scope.addNewInvited = function(invitedPerson) {
            var newInvited = {
                id : Math.floor((Math.random() * 1000) + 1),
                firstName : invitedPerson.firstName,
                lastName : invitedPerson.lastName,
                phoneNumber : invitedPerson.phoneNumber,
                mailAddress : invitedPerson.mailAddress,
                confirmationDate : invitedPerson.confirmationDate,
                man : invitedPerson.man,
                wasInvited: false
            };
            $scope.invitedPeople.push(newInvited);
            $scope.closeInvited();
            emptyInputs();
        };

        $scope.editInvited = function(invited) {

            $scope.showInvited();
            $scope.isHidden = false;
            $scope.invitedPerson = {
              id : invited.id,
              firstName : invited.firstName,
              lastName : invited.lastName,
              phoneNumber : invited.phoneNumber,
              mailAddress : invited.mailAddress,
              confirmationDate : invited.confirmationDate,
              man : invited.man,
              wasInvited : invited.wasInvited
            };
        };

        $scope.saveInvited = function(currentInvited) {
          var wantedInvited = _.find($scope.invitedPeople, { id : currentInvited.id} ); 
          _.merge(wantedInvited, currentInvited);
          $scope.closeInvited();
        };

        $scope.removeInvited = function(currentInvited) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Invited remove',
            template: 'Are you sure you want to remove <strong>' + currentInvited.firstName + ' ' + currentInvited.lastName + '</strong>?'
          });
          confirmPopup.then(function(res) {
            if(res) {
              var index = $scope.invitedPeople.indexOf(currentInvited);
              $scope.invitedPeople.splice(index, 1);
            } else {
              return;
            }
          });
        };

    });

}).call(this, this.angular);