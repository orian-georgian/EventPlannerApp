(function(angular){

    'use strict';

    var DataAdapter = new this.DataAdapter(),
        DataModel = this.DataModel;

    angular.module('events.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $cookieStore, AuthenticationService, AuthenticationModel, WeddingService) {

      var authModel = $cookieStore.get('login.state');
      $scope.minDate = new moment().format('YYYY-MM-DD');
      $scope.weddingPlan = {
        budget: 40000,
        date: '11/11/2014'
      };


      $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];

      $scope.needToAddHusband = false;
      $scope.needToAddWife = false;
          
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
        var confirmPopup = $ionicPopup.confirm({
          title: 'Logout',
          template: 'Are you sure you want to logoff?'
        });
        confirmPopup.then(function(res) {
          if(res) {
            AuthenticationService.logout().then();
          } else {
            return;
          }
        });
      };

      $scope.closeWeddingPlan = function() {
        $scope.weddingPlanModal.hide();
      };

      $scope.login = function() {
        AuthenticationService.login().then(function(authenticationModel){
            $scope.authenticationModel = authenticationModel;
        })
      };

      $scope.weddingPlanBox = function() {
        $scope.weddingPlanModal.show();
      };

      $scope.planYourWedding = function() {
          WeddingService.makeAWish($scope.weddingPlan).then(function(){
            $scope.closeWeddingPlan();
          });
      };

      $scope.openHusbandForm = function() {
        $scope.needToAddHusband = !$scope.needToAddHusband;
      };

      $scope.openWifeForm = function() {
        $scope.needToAddWife = !$scope.needToAddWife;
      };

      $scope.addHusbandInfo = function() {
        $scope.needToAddHusband = false;
      };

      $scope.addWifeInfo = function() {
        $scope.needToAddWife = false;
      };

      $scope.disableLink = function(){
        return $scope.needToAddWife;
      };


    })

    .controller('InvitedCtrl', function($scope, $ionicModal, $ionicPopup, InvitedService) {

      function initialize() {
        InvitedService.getGoogleContacts().then(function(data){
          $scope.invitedPeople = data;
        });
      }

      initialize();
        /*$scope.invitedPeople = DataAdapter.GetInvited();

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
*/
        $scope.removeInvited = function(currentInvited) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Invited remove',
            template: 'Are you sure you want to remove <strong>' + currentInvited.fullName + '</strong>?'
          });
          confirmPopup.then(function(res) {
            if(res) {
              InvitedService.removeContact(currentInvited.contactId).then(initialize);
            } else {
              return;
            }
          });
        };

    })

    .controller('EventsCtrl', function($scope, $timeout, $http, $cookieStore) {
      /*var authModel = $cookieStore.get('login.state');
      $http({
        url: 'https://www.google.com/m8/feeds/contacts/' + authModel.email + '/full?max-results=1000',
        method: 'GET',
        params: {
          access_token : authModel.token,
          alt: 'json'
        }
      })
      .success(function(data){
        console.log(data);
        $scope.
      })
      .error(function(error){
        console.log(error);
      });*/

    });

}).call(this, this.angular);