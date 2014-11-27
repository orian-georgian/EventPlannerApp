(function(){

	'use strict';

	var Contact =  this.Contact;

	function ContactsMapper() {

		function mapContacts(dto) {
			var contactsList = [];
			_.each(dto, function(d) {
				var contact = new Contact();
				contact.fullName = d.title.$t;
				contact.phoneNumber = d.gd$phoneNumber ? d.gd$phoneNumber[0].$t : null;
				contact.mailAddress = d.gd$email ? d.gd$email[0].address : null;
				contact.contactId = d.title.$t + contact.phoneNumber;
				contact.hasConfirmed = false;
				contact.homeAddress = d.gd$postalAddress ? d.gd$postalAddress[0].$t : null;
				contact.wasInvited = false;
				contact.tableNumber = null;
				contactsList.push(contact);
			});
			return contactsList;
		}

		function unmapContacts(contacts) {
			var contactsToSend = [], data = {};
			_.each(contacts, function(c) {
				data = {
					fullName : c.fullName,
					phoneNumber : c.phoneNumber,
					mailAddress : c.mailAddress,
					contactId : c.contactId,
					hasConfirmed : c.hasConfirmed,
					wasInvited : c.wasInvited,
					homeAddress : c.homeAddress,
					tableNumber : c.tableNumber
				};
				contactsToSend.push(data);
			});
			return contactsToSend;
		}

		this.mapContacts = mapContacts;
		this.unmapContacts = unmapContacts;

	}

	this.ContactsMapper = ContactsMapper;

}).call(this);