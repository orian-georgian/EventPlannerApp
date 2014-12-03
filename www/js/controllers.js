(function(angular){

    'use strict';

    angular.module('events.controllers', [])

    .controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $timeout, $cookieStore, AuthenticationService, AuthenticationModel, WeddingService) {

      var authModel = $cookieStore.get('login.state');
      $scope.minDate = new moment().format('YYYY-MM-DD');
      $scope.weddingPlan = {
        budget: 40000
      };

      $scope.datesAreEqual = function() {
          return $scope.minDate > $scope.weddingPlan.date;
      };

      $scope.isPositiveNumber = function(number) {
        return number < 0 || number > 50000;
      };

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
          });
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

      $scope.invitedContacts = [];
      $scope.isHidden = true;

      function isEmpty(data) {
        return _.isEmpty(data) || _.isNull(data) || _.isUndefined(data);
      }

      $ionicModal.fromTemplateUrl('templates/googleContacts.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.googleModal = modal;
        });

      $scope.importGoogleContacts = function() {
        InvitedService.getGoogleContacts().then(function(data){
          $scope.googleContacts = data;
          $scope.googleModal.show();
        });
      };

      $scope.closeGoogleContacts = function() {
        $scope.googleModal.hide();
      };

      $scope.saveContacts = function() {
        var selectedContacts = _.where($scope.googleContacts, {toSave:true});
        if (isEmpty(selectedContacts)) {
          $ionicPopup.alert({
           title: 'Attention!',
           template: 'Please select some contacts to add!'
         });
        } else {
          _.each(selectedContacts, function(contact) {
            if (!_.find($scope.invitedContacts, { contactId : contact.contactId })) {
              $scope.invitedContacts.push(contact);
            }
          });
          $scope.closeGoogleContacts();
          /*InvitedService.sendSelectedContacts(selectedContacts).then();*/
        }
      };

        $ionicModal.fromTemplateUrl('templates/newInvited.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.invitedModal = modal;
        });

        function emptyInputs() {
          $scope.invitedPerson = {
            fullName : null,
            phoneNumber : null,
            mailAddress : null,
            homeAddress : null
          };
          $scope.isHidden = true;
        }


        $scope.showInvited = function() {
          $scope.invitedModal.show();
        };

        $scope.closeInvited = function() {
          $scope.invitedModal.hide();
          emptyInputs();
        };

        $scope.addNewInvited = function(invitedPerson) {
            var contact = {
                contactId : invitedPerson.fullName + invitedPerson.phoneNumber,
                fullName : invitedPerson.fullName,
                phoneNumber : invitedPerson.phoneNumber,
                mailAddress : invitedPerson.mailAddress,
                homeAddress : invitedPerson.homeAddress,
                hasConfirmed : false,
                tableNumber : null,
                wasInvited : false
            };
            /*InvitedService.addNewContact(contact).then(function(){
              $scope.closeInvited();
              emptyInputs();
            });*/
            $scope.invitedContacts.push(contact);
            $scope.closeInvited();
        };

        $scope.editContact = function(currentContact) {

            $scope.showInvited();
            $scope.isHidden = false;
            $scope.invitedPerson = {
                contactId : currentContact.contactId,
                fullName : currentContact.fullName,
                phoneNumber : currentContact.phoneNumber,
                mailAddress : currentContact.mailAddress,
                homeAddress : currentContact.homeAddress,
                hasConfirmed : currentContact.hasConfirmed,
                tableNumber : currentContact.tableNumber,
                wasInvited : currentContact.wasInvited
            };
        };

        $scope.saveContact = function(currentContact) {
          var wantedInvited = _.find($scope.invitedContacts, { contactId : currentContact.contactId} ); 
          _.merge(wantedInvited, currentContact);
          $scope.closeInvited();
        };

        $scope.removeContact = function(currentContact) {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Remove contact',
            template: 'Are you sure you want to remove <strong>' + currentContact.fullName + '</strong>?'
          });
          confirmPopup.then(function(res) {
            if(res) {
              var index = $scope.invitedContacts.indexOf(currentContact);
              $scope.invitedContacts.splice(index, 1);
              /*InvitedService.removeContact(currentContact.contactId).then(initialize);*/
            } else {
              return;
            }
          });
        };

        $scope.confirmInvitation = function(contact) {
          contact.wasInvited = true;
        };

        $scope.confirmConfirmation = function(contact) {
          contact.hasConfirmed = true;
        };

        $scope.denyInvitation = function(contact) {
          contact.wasInvited = false;
        };

        $scope.denyConfirmation = function(contact) {
          contact.hasConfirmed = false;
        };



        $scope.isEmpty = isEmpty;

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