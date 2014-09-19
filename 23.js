
Stocks = new Meteor.Collection('stocks');
ChartTerms = new Meteor.Collection('terms');

var c1 = 3653;
var c2 =  730;
var c3 =   61;
var c4 =    1;

if (Meteor.isClient) {
  Template.user_loggedin.user = function() {
	return Meteor.user().username;
   };

  Template.user_loggedin.events({
    'click #logout' : function (e, tmpl) {
	Meteor.logout(function (err){
		if (err) {
			console.log(err);
		}
	});
    }
  });

  Accounts.ui.config({passwordSignupFields: 'USERNAME_AND_OPTIONAL_EMAIL' });

// Set the user in session
 //function setUser(context, page) {
 //    var safename = context.params.safename;
 //    Session.set("user", Meteor.users.findOne({'safename' : safename}));
 //}
// Routing
 //Meteor.pages({
 //     '/': { to: 'index' },
 //     '/users': { to: 'user_list' },
 //     '/users/:safename': { to: 'user_show_reading_list', before: setUser },
 //});
  
// Get the user in session
 //Template.user_show_reading_list.helpers({
 //    user: function() {
 //        return Session.get("user");
 //    }
 //});
 
 Template.chartterms.chartterms = function() {
	 return ChartTerms.find({name:resiliantusername() });
 }

 Template.stocks.stocks = function() {
	 return Stocks.find({name:resiliantusername() }, { sort: {desc: +1}});
 }
 
 function resiliantusername() {
  var name = 'nobody';
  if (Meteor.userId() && Meteor.user() && Meteor.user().profile)
  {
	  name = Meteor.user().profile.name;
  }
  else if (Meteor.userId())
  {
	  var foundUser = Meteor.users.findOne({_id:Meteor.userId()});
	  name = foundUser ? (foundUser.profile ? foundUser.profile.name : ( foundUser.username ? foundUser.username : "no username") ) : "no userId in Meteor";
  }
  return name;
 }

 Template.stock.getc1 = function() {
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne();
     console.log("c1 " + JSON.stringify(fo));
     console.log("c1 " + c1 + " " + fo.termc1);
     return fo.termc1? fo.termc1 : c1;
 };
 Template.stock.getc2 = function() {
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne();
     console.log("c2 " + JSON.stringify(fo));
     console.log("c2 " + c2 + " " + fo.termc2);
     return fo.termc2? fo.termc2 : c2;
 };
 Template.stock.getc3 = function() {
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne();
     console.log("c3 " + JSON.stringify(fo));
     console.log("c3 " + c3 + " " + fo.termc3);
     return fo.termc3? fo.termc3 : c3;
 };
 Template.stock.getc4 = function() {
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne();
     console.log("c4 " + JSON.stringify(fo));
     console.log("c4 " + c4 + " " + fo.termc4);
     return fo.termc4? fo.termc4 : c4;
 };

 Template.stocks.events = ({
   'click input.delete': function() {
      Stocks.remove(this._id);
   },
   'click input.edit': function() {
      document.getElementById('nrstock').value = this.nrstock;
      document.getElementById('stock').value = this.stock;
      document.getElementById('desc').value = this.desc;
      document.getElementById('tag').value = this.tag ? this.tag : "";
	   Session.set("selectedStock",this._id);
   },
   'click': function() {
	   Session.set("selectedStock",this._id);
          //document.getElementById('c4').value = c4;
   }
 });
 
Validation = {
  clear: function () { 
    return Session.set("error", undefined); 
    //document.getElementById('error').value = '';
  },
  set_error: function (message) {
    return Session.set("error", message);
    //document.getElementById('error').value = message;
  },
  needs_update: function (tag,desc,stock,nrstock) {
    if (this.stock_exists_unch(tag,desc,stock,nrstock)) {
      this.set_error("Stock is unchanged");
      return false;
    } else {
      this.set_error("OK");
      return true;
    }
  },
  inputAcceptable: function(tag,desc,stock,nrstock) {
    this.clear();
    if (stock.length == 0 || nrstock.length == 0) {
      this.set_error("Symbol can't be blank");
      return false;
    } else if (desc.length == 0) {
      this.set_error("Description can't be blank");
      return false;
    } else {
      this.set_error("OK");
      return true;
    }
  },
  inputtermAcceptable: function(vc) {
    this.clear();
    if (vc.length == 0) {
      this.set_error("Chart term can't be blank");
      return false;
    } else {
      this.set_error("OK");
      return true;
    }
  },
  exists: function (tag,desc,stock,nrstock) {
    if (this.stock_exists(stock)) {
      this.set_error("Stock exists");
      return true;
    } else {
      this.set_error("OK");
      return false;
    }
  },
  stock_exists: function(stock) {
    return Stocks.findOne({name:resiliantusername(), stock: stock});
  },
  stock_exists_unch: function(tag,desc,stock,nrstock) {
    return Stocks.findOne({name:resiliantusername(), tag: tag, desc: desc, stock: stock, nrstock: nrstock});
  }
};
 
Template.input.checked = function(currentValue) {
	  //var checked = document.getElementById('StockOptions').value;
	  //var iChecked = true;
	  //document.getElementById('tag').value = 'valueis';
	  //document.getElementById('tag').value = '';
	  //Session.set("EditingStock",checked);
    var currentValue = '1';
    return currentValue == '1' ? 'checked' : '';
//	  return currentValue == '1' ? ' checked="checked"' : '';
	};
 //});
 Template.input.error = function() {
	 return Session.get("error");
 };
 Template.input.events = {
  'keydown input#stock' : function(event) {
	  if (event.which == 13) {
		  var name = resiliantusername();
		  var nrstock = document.getElementById('nrstock').value.trim();
		  var stock = document.getElementById('stock').value.trim();
		  var desc = document.getElementById('desc').value.trim();
		  var tag = document.getElementById('tag').value.trim();
		  if (Validation.inputAcceptable(tag,desc,stock,nrstock)) {
		      if (!Validation.exists(tag,desc,stock,nrstock)) {
			    Stocks.insert({ name: name, tag: tag, desc:desc, stock:stock, nrstock: nrstock});
			    document.getElementById('stock').value = '';
			    document.getElementById('nrstock').value = '';
			    //document.getElementById('desc').value = '';
			    nrstock.value = '';
			    stock.value = '';
			    desc.value = '';
			    tag.value = '';
		      } else if (Validation.needs_update(tag,desc,stock,nrstock)) {
			    document.getElementById('nrstock').value = '';
			    document.getElementById('stock').value = '';
			    var id = Session.get("selectedStock");
			    Stocks.remove(id);
			    document.getElementById('desc').value = '';
			    Stocks.insert({ name: name, tag: tag, desc:desc, stock:stock, nrstock: nrstock});
			    document.getElementById('tag').value = '';
		      } else {
			    document.getElementById('tag').value = '';
		      }
		      nrstock.value = '';
		      stock.value = '';
		      desc.value = '';
		      tag.value = '';
		  }
	  }
	  else
	    document.getElementById('error').value = '';
  }
 }

 Template.inputchartterms.error = function() {
	 return Session.get("error");
 };
 
 Template.inputchartterms.events = {
  'keydown input#c1' : function(event) {
	  if (event.which == 13) {
        console.log("c1 13");
		  var name = resiliantusername();
		  var vc = document.getElementById('c1').value.trim();
		  if (Validation.inputtermAcceptable(vc)) {
              c1 = vc;
              ChartTerms.update(this._id, {$set: {termc1: vc}});
		  }
	  }
	  else
	    document.getElementById('error').value = '';
  },
  'keydown input#c2' : function(event) {
	  if (event.which == 13) {
        console.log("c2 13");
		  var name = resiliantusername();
		  var vc = document.getElementById('c2').value.trim();
		  if (Validation.inputtermAcceptable(vc)) {
              c2 = vc;
              ChartTerms.update(this._id, {$set: {termc2: vc}});
		  }
	  }
	  else
	    document.getElementById('error').value = '';
  },
  'keydown input#c3' : function(event) {
	  if (event.which == 13) {
        console.log("c3 13");
		  var name = resiliantusername();
		  var vc = document.getElementById('c3').value.trim();
		  if (Validation.inputtermAcceptable(vc)) {
              c3 = vc;
              ChartTerms.update(this._id, {$set: {termc3: vc}});
		  }
	  }
	  else
	    document.getElementById('error').value = '';
  },
  'keydown input#c4' : function(event) {
	  if (event.which == 13) {
        console.log("c4 13");
		  var name = resiliantusername();
		  var vc = document.getElementById('c4').value.trim();
		  if (Validation.inputtermAcceptable(vc)) {
              c4 = vc;
              ChartTerms.update(this._id, {$set: {termc4: vc}});
		  }
	  }
	  else
	    document.getElementById('error').value = '';
  }
 }

}

if (Meteor.isServer) {

  Meteor.startup(function () {
    // code to run on server at startup
    if (Stocks.find().count() === 0) {
	    Stocks.insert({name: "themr23", tag: "Index", desc: "_Index, Dow Jones", stock: ".DJI", nrstock: ".DJI"});
	    Stocks.insert({name: "themr23", tag: "Emp", desc: "Rudolph", stock: "RTEC.N", nrstock: "RTEC"});
	    Stocks.insert({name: "themr23", tag: "Comp", desc: "KLA-Tencor", stock: "KLAC.O", nrstock: "KLAC" });
	    Stocks.insert({name: "test", tag: "Index", desc: "_Index, Dow Jones", stock: ".DJI", nrstock: ".DJI"});
	    Stocks.insert({name: "test", tag: "Emp", desc: "Rudolph", stock: "RTEC.N", nrstock: "RTEC"});
	    Stocks.insert({name: "test", tag: "Comp", desc: "KLA-Tencor", stock: "KLAC.O", nrstock: "KLAC" });
    }
    if (ChartTerms.find().count() === 0) {
        ChartTerms.insert({name: "themr23", termc1: "3653",
                           termc2: "730", termc3: "61", termc4: "1"});
    }
  });
 
  Accounts.onCreateUser(function (options, user) {
   if(user.services.twitter) {
     user.username = user.services.twitter.screenName;
     user.avatar = user.services.twitter.profile_image_url;
   }

  if(user.services.facebook) {
     user.username = user.services.facebook.name;
     user.avatar = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=square";
   }
   return user;
  });
  
}
