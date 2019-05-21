$(function() {

  $.jsonRPC.setup({
      endPoint : 'http://localhost:3000/api',
      namespace : ''
  });
  
  $("#login_button").click(function() {

      chrome.identity.getProfileUserInfo(function(userInfo) {
        var UserEmail, UserID;
          UserEmail = JSON.stringify(userInfo.email);
          UserID = JSON.stringify(userInfo.id);
      console.log(UserEmail+"/"+UserID);

      var method = 'echo';
		  $.jsonRPC.request(method, {
			id: 1001,
			params: [UserEmail,UserID],
			success: function(data) {
				println('정상 응답을 받았습니다.');
				console.dir(data);
				
				println(data.result);
			},
			error: function(data) {
				println('에러 응답을 받았습니다.');
				console.dir(data);
				
				println(data.error.message);
			}
		});
		println('[' + method + '] method로 요청을 보냈습니다.');

    });
  });  
});

function println(data) {
  $("#results").append('<p>' + data + '</p>');
}
