(function(){

	'use strict';

	var Invited =  this.Invited;

	function InvitedMapper() {

		function mapInvited(dto) {
			var invitedList = [];
			_.each(dto, function(d) {
				var invited = new Invited();
				invited.fullName = d.title.$t;
				invited.phoneNumber = d.gd$phoneNumber ? d.gd$phoneNumber[0].$t : null;
				invited.emailAddress = d.gd$email ? d.gd$email[0].address : null;
				invited.contactId = invited.getId(d.id.$t);
				invited.confirmed = false;
				invited.homeAddress = d.gd$postalAddress ? d.gd$postalAddress[0].$t : null;
				invited.masculin = true;
				invitedList.push(invited);
			});
			return invitedList;
		}

		this.MapInvited = mapInvited;

	}

	this.InvitedMapper = InvitedMapper;

}).call(this);