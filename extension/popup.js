
  document.addEventListener('DOMContentLoaded', function(){
    var login_button = document.getElementById("login_button");   
     login_button.addEventListener("click", function(){

        chrome.identity.getProfileUserInfo(function(userInfo) {

            console.log(JSON.stringify(userInfo));

          });
    } 
);
});
