(function(){

	'use strict';

	function Invited() {

		function getContactId(id) {
			return id.slice(72);
		}

		this.contactId = null;
		this.fullName = null;
		this.phoneNumber = null;
		this.emailAddress = null;
		this.homeAddress = null;
		this.confirmed = false;
		this.masculin = true;

		this.getId = getContactId;
	}

	this.Invited = Invited;

}).call(this);