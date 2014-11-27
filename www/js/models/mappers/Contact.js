(function(){

	'use strict';

	function Contact() {

		function getContactId(id) {
			return id.slice(72);
		}

		this.contactId = null;
		this.fullName = null;
		this.phoneNumber = null;
		this.emailAddress = null;
		this.homeAddress = null;
		this.hasConfirmed = false;
		this.wasInvited = false;
		this.tableNumber = null;

		this.getId = getContactId;
	}

	this.Contact = Contact;

}).call(this);