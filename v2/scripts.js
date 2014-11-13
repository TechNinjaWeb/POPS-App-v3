$(document).ready(function(){
    console.log("Initializing Parse...");
    Parse.initialize("tW7joSULiozJDKKmR4gV13rkdmoZKAtq8rzj7GpB", "YDQZaea8U4z16UHNjj4080GvVQEb5KZpeWiVq4sT");
    console.log("Success");

});

function facebookLogin(){
    Parse.FacebookUtils.logIn(null, {
      success: function(user) {
        if (!user.existed()) {
          alert("User signed up and logged in through Facebook!");
        } else {
          alert("User logged in through Facebook!");
        }
      },
      error: function(user, error) {
        alert("User cancelled the Facebook login or did not fully authorize.");
      }
    });   
}

function facebookInit(){
    ///////////////////////// FACEBOOK SDK ////////////////////////////
    Parse.initialize("796575453734742", "czaxg36kOK9opjz1daFymyXWk6YWEaHTgOH0GClk");
        window.fbAsyncInit = function() {
        FB.init({
          appId      : '796575453734742',
          xfbml      : true,
          version    : 'v2.2'
        });
/// Code Execute after Init ///
        var user = Parse.User.current();
        if (user) {
            var name = user.get('username');
            var total = user.get('balance').toFixed(2);
            var status = user.get('accountStatus');
            var email = user.get('email');
            var profilePic = user.get('profileImage');
            console.log("User"+name+" logged in");
        } else {
            // show the signup or login page 
            console.log("No user logged in.");
        }
/// -------- Code Execute after Init ---------///
      };

      (function(d, s, id){
         var js, fjs = d.getElementsByTagName(s)[0];
         if (d.getElementById(id)) {return;}
         js = d.createElement(s); js.id = id;
         js.src = "//connect.facebook.net/en_US/sdk.js";
         fjs.parentNode.insertBefore(js, fjs);
       }(document, 'script', 'facebook-jssdk');
    });
});
///////---------------- FACEBOOK SDK -------------------///////
}