
  document.addEventListener('DOMContentLoaded', function(){

    var login_Info;
    var login_button = document.getElementById("login_button");   
     login_button.addEventListener("click", function(){

        chrome.identity.getProfileUserInfo(function(userInfo) {


            console.log("Email : " +userInfo.email);
            console.log("ID : " +userInfo.id);

            login_Info = JSON.stringify(userInfo);

            console.log(login_Info);

          });
    } 
);
});
