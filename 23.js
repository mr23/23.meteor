
Stocks = new Meteor.Collection('stocks');
ChartTerms = new Meteor.Collection('terms');
AllVisits = new Meteor.Collection('visits');

var c1 = 3653;
var c2 =  730;
var c3 =   61;
var c4 =    1;

if (Meteor.isClient) {
  var d = new Date();
  var sid = AllVisits.insert({date: d});
  Session.set("SVselectedVisit",sid);

  Template.header.userCount = function() {
    return Meteor.users.find().count();
  };
  Template.header.visitorCount = function() {
      return AllVisits.find().count();
  };
   Template.visitors.visitors = function() {
	  var items =  AllVisits.find({},{sort: {date: +1}}).fetch();
      return items.slice(-10);
  };

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
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne({name:"guest"});
	 return [fo];
 }

 Template.stocks.stocks = function() {
     var rUN = resiliantusername();
     var fa = Stocks.find({name:rUN}, { sort: {desc: +1}});
     if (!fa) fa = Stocks.find({name:"guest"}, { sort: {desc: +1}});
     console.log("fa " + rUN + " "  + JSON.stringify(fa));
	 return fa;
 }
 
 function resiliantusername() {
  var name = "guest";
  if (Meteor.userId() && Meteor.user() && Meteor.user().profile)
  {
	  name = Meteor.user().profile.name;
      console.log("rUNi: " + name);
  }
  else if (Meteor.userId())
  {
	  var foundUser = Meteor.users.findOne({_id:Meteor.userId()});
	  name = foundUser ? (foundUser.profile ? foundUser.profile.name : ( foundUser.username ? foundUser.username : "guest") ) : "guest";
      console.log("rUNe: " + name);
  }
  return name;
 }

 Template.stock.getc1 = function() {
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne({name:"guest"});
     //console.log("c1 " + JSON.stringify(fo));
     return fo && fo.termc1? fo.termc1 : c1;
 };
 Template.stock.getc2 = function() {
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne({name:"guest"});
     return fo && fo.termc2? fo.termc2 : c2;
 };
 Template.stock.getc3 = function() {
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne({name:"guest"});
     return fo && fo.termc3? fo.termc3 : c3;
 };
 Template.stock.getc4 = function() {
     var rUN = resiliantusername();
     var fo = ChartTerms.findOne({name:rUN});
     if (!fo) fo = ChartTerms.findOne({name:"guest"});
     return fo && fo.termc4? fo.termc4 : c4;
 };

 Template.stocks.events = ({
   'click input.delete': function() {
     var rUN = resiliantusername();
     var fa = Stocks.find({name:rUN});
    //document.getElementById('error').value = 'fa';
     if (!fa || rUN == "guest") {
         if (!fa) fa = Stocks.find({name:"guest"});
         if (fa.count() > 3) {
             Stocks.remove(this._id);
         }
      }
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
        ProcessStockInput(event);
  },
  'keydown input#nrstock' : function(event) {
        ProcessStockInput(event);
  }
 };

 ProcessStockInput = function(event) {
	  if (event.which == 13 || event.which == 9) {
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
 };

 Template.inputchartterms.error = function() {
	 return Session.get("error");
 };
 
 Template.inputchartterms.events = {
  'keydown input#c1' : function(event) {
	  if (event.which == 13 || event.which == 9) {
        var rUN = resiliantusername();
		  var name = resiliantusername();
		  var vc = document.getElementById('c1').value.trim();
		  if (Validation.inputtermAcceptable(vc)) {
              c1 = vc;
              var fo = ChartTerms.findOne({name:rUN});
              if (fo) { // assume they had one
              ChartTerms.update(this._id, {$set: {termc1: c1}});
              }
              else  // otherwise full insert instead
              {
                ChartTerms.insert({name: rUN, termc1: c1,
                                   termc2: "730", termc3: "61", termc4: "3"});
              }
		  }
	  }
	  else
	    document.getElementById('error').value = '';
  },
  'keydown input#c2' : function(event) {
	  if (event.which == 13 || event.which == 9) {
        var rUN = resiliantusername();
		  var name = resiliantusername();
		  var vc = document.getElementById('c2').value.trim();
		  if (Validation.inputtermAcceptable(vc)) {
              c2 = vc;
              var fo = ChartTerms.findOne({name:rUN});
              if (fo) { // assume they had one
              ChartTerms.update(this._id, {$set: {termc2: c2}});
              }
              else  // otherwise full insert instead
              {
                ChartTerms.insert({name: rUN, termc1: "3653",
                                   termc2: c2, termc3: "61", termc4: "3"});
              }
		  }
	  }
	  else
	    document.getElementById('error').value = '';
  },
  'keydown input#c3' : function(event) {
	  if (event.which == 13 || event.which == 9) {
        var rUN = resiliantusername();
		  var name = resiliantusername();
		  var vc = document.getElementById('c3').value.trim();
		  if (Validation.inputtermAcceptable(vc)) {
              c3 = vc;
              var fo = ChartTerms.findOne({name:rUN});
              if (fo) { // assume they had one
              ChartTerms.update(this._id, {$set: {termc3: c3}});
              }
              else  // otherwise full insert instead
              {
                ChartTerms.insert({name: rUN, termc1: "3653",
                                   termc2: "730", termc3: c3, termc4: "3"});
              }
		  }
	  }
	  else
	    document.getElementById('error').value = '';
  },
  'keydown input#c4' : function(event) {
	  if (event.which == 13 || event.which == 9) {
        var rUN = resiliantusername();
		  var name = resiliantusername();
		  var vc = document.getElementById('c4').value.trim();
		  if (Validation.inputtermAcceptable(vc)) {
              c4 = vc;
              var fo = ChartTerms.findOne({name:rUN});
              if (fo) { // assume they had one
              ChartTerms.update(this._id, {$set: {termc4: vc}});
              }
              else  // otherwise full insert instead
              {
                ChartTerms.insert({name: rUN, termc1: "3653",
                                   termc2: "730", termc3: "61", termc4: c4});
              }
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
	    Stocks.insert({name: "themr23", tag: "SEMI", desc: "Rudolph", stock: "RTEC.N", nrstock: "RTEC"});
	    Stocks.insert({name: "themr23", tag: "SEMI", desc: "KLA-Tencor", stock: "KLAC.O", nrstock: "KLAC" });
	    Stocks.insert({name: "guest", tag: "Index", desc: "_Index, Dow Jones", stock: ".DJI", nrstock: ".DJI"});
	    Stocks.insert({name: "guest", tag: "Auto", desc: "Ford", stock: "F", nrstock: "F"});
	    Stocks.insert({name: "guest", tag: "Comp", desc: "KLA-Tencor", stock: "KLAC.O", nrstock: "KLAC" });
	    Stocks.insert({name: "guest", tag: "SEMI", desc: "Rudolph", stock: "RTEC.N", nrstock: "RTEC"});
    }
    if (ChartTerms.find().count() === 0) {
        ChartTerms.insert({name: "guest", termc1: "3653",
                           termc2: "730", termc3: "61", termc4: "3"});
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
