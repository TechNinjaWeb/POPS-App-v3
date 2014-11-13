$(document).ready(function(){
    $(".adminAccess").hide();
    console.log("<-----------Initializing --------------");
    console.log("|                                      |");
    console.log("|       Alpha Nerds Media Ltd.");
    console.log("|      www.alphanerdsmedia.com         |");
    console.log("|                                      |");
    console.log("|                                      |");
    console.log("--------------------------------------->");
    console.log("Initializing Parse...");
    console.log("Success");
////////// Initialize Parse & FB Login /////////////////
    console.log("Initializing FB User Login");
      Parse.initialize("tW7joSULiozJDKKmR4gV13rkdmoZKAtq8rzj7GpB", "YDQZaea8U4z16UHNjj4080GvVQEb5KZpeWiVq4sT");
      window.fbAsyncInit = function() {
        Parse.FacebookUtils.init({
          appId      : '796575453734742',
          xfbml      : true,
          version    : 'v2.2'
        });
          
/// -------- Code Execute after Init ---------///
        var user = Parse.User.current();
        if (user) {
            console.log("<------------------------------------>");
            console.log("User Logged In");
            updateUserData(user)
            adminCheck();
        } else {
            // show the signup or login page 
            console.log("No user logged in.");
            $.mobile.changePage( "#home", { transition: "slideup", changeHash: true });
        }
/// -------- Code Execute after Init ---------///   
          
      };
      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk'));
    console.log("Success");

    $("#signUpBttn").click(function(){
        console.log("click");
        addNewUser();   
    });
    $("#loginBttn").click(function(){
        userLogin();
    });
    
});
////////// Initialize Parse & FB Login /////////////////



//////////////////    CLOUD CODE     //////////////////
/*/////////////////// Add Drink ////////////////*/
function addDrink(user,qty){
    console.log("Initializing Parse Cloud Connection");
    console.log("Placing Order to System");
    Parse.Cloud.run('addDrink', {user: user, qty: qty}, {
      success: function(results) {
         console.log(results);
      },
      error: function(error) {
      }
    });    
}


/*////////// CREATE NEW USER ////////////////*/
function addNewUser(){
    console.log("Creating New User");
    var user = new Parse.User();
    var myEmail = $("#myEmail").val();
    var myPass = $("#myPass").val();
    user.set("username", myEmail);
    user.set("password", myPass);
    user.set("fullName",myEmail);
    user.set("email",myEmail)
    user.set("balance",0);
    user.set("myTeam","Add Your Team Here");
    user.set("notes","No notes to display as of yet...");
    user.set("accountStatus","active");
    user.set("profileImage","http://cdn.androidpolice.com/wp-content/uploads/2013/04/nexusae0_googlenow_help_avatar_thumb.png");
    // Sign up user //
    console.log("Invoke signup");
    user.signUp(null, {
      success: function(user) {
         console.log("Successfully Saved User");
         populateNewUserData(user);
         adminCheck();
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        console.log("Error: " + error.code + " " + error.message);
        demoNoticeBottomRight(error.message,"Error")
      }
    });
}

/*////////// USER LOGIN ////////////////*/
function userLogin(){
    var myLoginEmail = $('#myEmail').val();
    var myLoginPass = $('#myPass').val();
    Parse.User.logIn(myLoginEmail, myLoginPass, {
      success: function(user) {
        // Do stuff after successful login.
        console.log("Successfully logged in: "+user.get('username')); 
        $("#myEmail").val('');
        $("#myPass").val(''); 
        adminCheck();
        updateUserData(user);
      },
      error: function(user, error) {
        // The login failed. Check error to see why.
        console.log("No Luck");
        demoNoticeBottomRight(error.message,"Error")
      }
    });    
}


/// -------- POPULATE NEW USER DATA ---------///
function populateNewUserData(user){
    console.log("<------------------------------------>");
    console.log("Capturing User Data from Facebook");
    FB.api('/me', function(response) {
      var object = response;
      console.log('Your name is ' + object.name);
        user.set("fullName",object.name);
        user.set("firstName",object.first_name);
        user.set("lastName",object.last_name);
        user.set("email",object.email)
        user.set("gender",object.gender);
        user.set("locale",object.locale);
        user.set("ageRange",object.age_range);
        user.set("fbLink",object.link);
        user.set("balance",0);
        user.set("myTeam","Not Selected");
        user.set("notes","No notes to display as of yet...");
        user.set("accountStatus","active");
        if (object.name == "Jeffrey Coleman"){
            user.set("adminAccess",true);
        }
        user.save();
    });
    FB.api('/me/picture',{"type":"normal"}, function(response) {
        var object = response;
        console.log("profile Pic Located at: "+object.data.url);
        user.set("profileImage",object.data.url);
        user.save(); 
    });
    updateUserData(user);
}
/// -------- NEW USER PROFILE Create ---------///



/// -------- UPDATE USER DATE ---------///
function updateUserData(user){
    console.log("<------------------------------------>");
    console.log("Populate User Data - Called");
    var userid = user.id;
    var name = user.get('fullName');
    var team = user.get('myTeam');
    var notes = user.get('notes');
    var status = user.get('accountStatus');
    var email = user.get('email');
    var balance = user.get('balance');
    var profileImage = user.get('profileImage');
    console.log("Variables Stored");
    console.log("<------------------------------------>");
    console.log("Inserting to DOM");
    $("#userID").text("ID: "+userid);
    $("#userName").text(name);
    $("#userTeam").text(team);
    $("#userExtra").text("User Notes: "+notes);
    $("#userBalance").text("Balance: $"+balance);
    $("#userStatus").text("Status: "+status);
    $("#userEmail").html("Email: <a href='mailto:"+email+"'>"+email+"</a>");
    $("#userProfileImage").html("<img class='profilePic' src='"+profileImage+"'/>");
    $("#userProfileBalance").text(" $"+balance);
    $("#userPayTab #userID").attr("id",userid);
    console.log("Complete");
    console.log("<------------------------------------>");
    console.log("Building Select Boxes");
    buildTeamSelect("#teamSelect");
    buildUserSelect("#userSelect");
    buildOrderSelect("#orderSelect");
    console.log("<------------------------------------>");
    getUserTabs("#userTabList");
    buildTeamSelect("#tabListView");

}
/// -------- UPDATE USER DATA ---------///


/// -------- FB LOGIN Button ---------///
function facebookLogin(){
    Parse.FacebookUtils.logIn("user_likes,email,read_friendlists", {
      success: function(user) {
        if (!user.existed()) {
            console.log("<------------------------------------>");
            console.log("User signed up and logged in through Facebook!");
            demoNoticeBottomRight("Account created and now logging you in...","Success")
            populateNewUserData(user);
            adminCheck();
        } else {
            console.log("<------------------------------------>");
            console.log("User logged in through Facebook!");
            demoNoticeBottomRight("Logging you in...","Success")
            updateUserData(user);
            adminCheck();
        }
      },
      error: function(user, error) {
            console.log("User cancelled the Facebook login or did not fully authorize.");
            demoNoticeBottomRight(error.message,"Error")
      }
    });
}
/// -------- FB LOGIN Button ---------///




////////// Build Team Select Box /////////////////
function buildTeamSelect(target){
    console.log("Build Team Select List Started");
    var TabList = Parse.Object.extend("TabLists");
    var teamQuery = new Parse.Query(TabList);
    teamQuery.exists("tabName");
    teamQuery.find({ 
      success: function(results) {
        // results has the list of teams
          console.log("There were "+results.length+" teams found");
          for (var i = 0; i < results.length; i++) { 
              var object = results[i];
              var totalOwed = object.get('totalOwing').toFixed(2);
              $(target).append("<li><a href='#'>"+object.get('tabName')+"<span class='ui-li-count'>$"+totalOwed+"</span></a></li>");
          }
          $( "#tabListView" ).listview( "refresh" );
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
}



////////// Build User Select Box /////////////////
function buildUserSelect(target){
    console.log("Build User Select List Started");
    $(target).html("<option value='0'>Select User</option>");
    var query = new Parse.Query(Parse.User);
    query.exists("username");
    query.find({ 
      success: function(results) {
          console.log("There were "+results.length+" users found");
        // results has the list of teams
          for (var i = 0; i < results.length; i++) { 
              var object = results[i];
              $(target).append("<option value='"+object.id+"'>"+object.get('fullName')+"</object>");
          }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
}



////////// Build Order Select Box  /////////////////
function buildOrderSelect(target){
    console.log("Build Drink Order List Started");
    $(target).html("<option value='0'>Select Team</option>");
    var query = new Parse.Query("OrderList");
    query.exists("orderQty");
    query.find({ 
      success: function(results) {
        // results has the list of teams
          console.log("There were "+results.length+" orders found");
          for (var i = 0; i < results.length; i++) { 
              var object = results[i];
              var date = object.get('createdAt');
              $(target).append("<option value='"+object.id+"'>Order ID: "+object.id+" by "+object.get('username')+" on "+date+"</object>");
          }
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
}




/*////////// Player(s) WITH Balance to List ////////////////*/
function getUserTabs(user){
    console.log("Call for user tab list...");
    var query = new Parse.Query(Parse.User);
    query.exists("username");
    query.find({
      success: function(results) {
        // Do stuff
          console.log("Success: "+results.length+" tabs oweing found.");
          $("#userTabList").html('');
          for (i=0;i<results.length;i++){
              var name = results[i].get('fullName');
              var team = results[i].get('myTeam');
              var userId = results[i].id;
              var balance = results[i].get('balance');
              var amountOwing = (balance).toFixed(2);
              var profilePhoto = results[i].get("profileImage");
              $("#userTabList").append("<li><a href='#'><img src='"+profilePhoto+"' class='ui-li-thumb'/><h4>"+name+"</h4><p>"+team+"</p><span class='ui-li-count'>$"+amountOwing+"</span></a><a class='addDrinkBttn' id='"+userId+"' href='#' data-position-to='window' data-transition='pop'></a></li>");
          }
          $("#userTabList").listview( "refresh" );
      }
    });
}





//////////////////////////////////////////
//////////////////////////////////////////
////////// LOGIN BUTTON /////////////////
$(document).on("click", "#fbLoginButton", function () {
    console.log("Button '"+$(this).attr('id')+"' clicked"); 
    facebookLogin();
});

$(document).on("click", "#userView", function () {
    console.log("Button '"+$(this).attr('id')+"' clicked"); 
    $.mobile.changePage( "#userPage", { transition: "slideup", changeHash: false });  
});

$(document).on("click", ".addDrinkBttn", function () {
    var user = Parse.User.current();
    var userName = user.get('fullName');
    var message = "Transaction has been processed.";
    var title = userName+" tabbed a POP";
    addDrink("testuser",2);
    demoNoticeBottomRight(message,title);
});


////////// LOGOUT BUTTON /////////////////
$(document).on("click", "#fbLogoutButton", function () {
    console.log("Button '"+$(this).attr("id")+"' clicked"); 
    Parse.User.logOut();
    $.mobile.changePage( "#home", { transition: "slideup", changeHash: false });
    $(".adminAccess").hide();
    var currentUser = Parse.User.current();  // this will now be null
    $("#userID").text("");
    $("#userName").text("");
    $("#userTeam").text("");
    $("#userExtra").text("");
    $("#userBalance").text("");
    $("#userStatus").text("");
    $("#userEmail").text("");
    console.log("User: "+currentUser);
    demoNoticeBottomRight("User logged out","Success");
});


//////////    ADMIN CHECK FUCTION    ////////
function adminCheck(){
    var user = Parse.User.current();
    if (user.get('adminAccess') === true){
        console.log("ADMIN ACCESS GRANTED");
        $.mobile.changePage( "#adminPage", { transition: "slideup", changeHash: false });    
        $(".adminAccess").show();
        demoNoticeBottomRight("Admin Access Granted","Success")
    }else{
        console.log("RESTRICTED ACCESS GRANTED");
        $.mobile.changePage( "#userPage", { transition: "slideup", changeHash: false });
        $(".adminAccess").hide();
    }
}



//////////    NOTICE FUNCTION    ////////
function demoNoticeBottomRight(message,title) {
    new jBox('Notice', {
        title: title,
        stack: true,
        content: message,
        minWidth: '500',
        color:'red',
        audio: 'mp3/beep',
        volume: '50',
        autoClose: '1500',
        animation:{
            open:'zoomIn',
            close:'zoomOut'
        },
        attributes: { // Notices have a fixed position, that's why you need to change the attribute option to move them
            x: 'center',
            y: 'bottom',
        }
    });
}