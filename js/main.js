
$(document).ready(function() {

	FB.init({
        appId      : '348725015219063', // App ID
        channelUrl : '//http://dev.asdfap.caffodiangmailcom.stackmobapp.com/channel.html', // Channel File
        status     : true, // check login status
        cookie     : true, // enable cookies to allow the server to access the session
        xfbml      : true  // parse XFBML
      });
        // listen for and handle auth.statusChange events
        FB.Event.subscribe('auth.statusChange', function(response) {
          if (response.authResponse) {
            // user has auth'd your app and is logged into Facebook
            FB.api('/me', function(me){
              if (me.name) {
                document.getElementById('auth-displayname').innerHTML = me.name;
              }
            })
            document.getElementById('auth-loggedout').style.display = 'none';
            document.getElementById('auth-loggedin').style.display = 'block';

            getLikes();
          } else {
            // user has not auth'd your app, or is not logged into Facebook
            document.getElementById('auth-loggedout').style.display = 'block';
            document.getElementById('auth-loggedin').style.display = 'none';
          }
        });

        // respond to clicks on the login and logout links
        document.getElementById('auth-loginlink').addEventListener('click', function(){
          FB.login(function(response) {
            if (response.authResponse) {
              var accessToken = response.authResponse.accessToken;
              FB.api('/me', function(response) {
                var user = new StackMob.User({ username: response.email });
                user.createUserWithFacebook(accessToken);
              });
            } else {
              console.log('User cancelled login or did not fully authorize.');
            }
          }, {scope: 'email, user_likes'});
        }
        );
        document.getElementById('auth-logoutlink').addEventListener('click', function(){
          FB.logout();
        });
      });

var getLikes = function() {
	FB.api('/me/likes', function(response) {
		for (var x in response.data) {
			var item = response.data[x];

			if (isOwnable(item))  {
				var newDiv = $('<div/>', {
         html: item.name,
       });
        newDiv.click(function() {
          //add to the user's "ownage"
          FB.api('/me/asdfap-test:own', 'post', { object:item.id }, function(response) {
            alert("You owned "+item.id);
          });

        });
        $('#items').append(newDiv);
      }


    }
  });
}

var postOwn = function(itemid) {
  FB.api('/me/asdfap-test:own', 'post', { object:itemid }, function(response) {
    alert("You owned "+itemid);

  });
}

var isOwnable = function(fbObject) {
 if (fbObject.category == "Games/toys" || fbObject.category == "Book") {
  return true;
}
else return false;
}
