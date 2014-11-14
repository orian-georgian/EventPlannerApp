(function(angular){

    'use strict';

    var DataAdapter = new this.DataAdapter(),
        DataModel = this.DataModel;

    angular.module('events.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $timeout, $cookieStore, AuthenticationService, AuthenticationModel) {

      var authModel = $cookieStore.get('login.state');
      if (authModel) {
        AuthenticationModel = authModel;
        $scope.authenticationModel = authModel;
      } else {
        $scope.authenticationModel = AuthenticationModel;
      }
      
     
      $ionicModal.fromTemplateUrl('templates/weddingPlan.html', {
        scope: $scope
      }).then(function(modal) {
        $scope.weddingPlanModal = modal;
      });

      $scope.logout = function() {
        gapi.auth.signOut();
        AuthenticationModel.isLoggedIn = false;
        $cookieStore.remove('login.state');
      };

      $scope.closeWeddingPlan = function() {
        $scope.weddingPlanModal.hide();
      };

      $scope.login = function() {
        AuthenticationService.login($scope).then(function(authenticationModel){
            $scope.authenticationModel = authenticationModel;
        })
      };

      $scope.weddingPlan = function() {
        $scope.weddingPlanModal.show();
      };

      $scope.weddingPlan.budget = 40000;

    })

    .controller('EventsCtrl', function($scope, $timeout) {
        $timeout(function(){
            gapi.client.oauth2.userinfo.get().execute(function (response){
        console.log(response);
      });
        }, 2000);
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