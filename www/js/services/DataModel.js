(function(){

	'use strict';

	function DataModel() {

		function Invited() {
			this.firstName =  null;
			this.lastName =  null;
			this.phoneNumber =  null;
			this.confirmationDate =  null;
			this.mailAddress = null;
			this.man = true;
		}

		this.Invited = Invited;
	}

	this.DataModel = new DataModel();	

}).call(this);