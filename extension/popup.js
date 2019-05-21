var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://localhost:3000/api/WBF",
  "method": "GET",
  "headers": {
    "cache-control": "no-cache",
  }
}
              
$(function() {
  $("#POST_BTN").click(function() {

		var now = new Date();
	
		var year= now.getFullYear();
		var mon = (now.getMonth()+1)>9 ? ''+(now.getMonth()+1) : '0'+(now.getMonth()+1);
		var day = now.getDate()>9 ? ''+now.getDate() : '0'+now.getDate();
		var hour = now.getHours();
		var min = now.getMinutes();
		var sec = now.getSeconds();
	
		var timeNow = year;timeNow += mon;timeNow += day;timeNow	+= hour;timeNow += min;timeNow += sec;
			console.log(timeNow);

		chrome.identity.getProfileUserInfo(function(userInfo){
			$.ajax({
					"async": true,
  				"crossDomain": true,
					"url": "http://localhost:3000/api/WBF",
					"method": "POST",
					"headers": {
						"content-type": "application/json",
						"cache-control": "no-cache",
					},
					"processData": false,
					success: function(data){
						console.log(data);
					},
					"data":JSON.stringify({'userID':userInfo.id,'userEmail':userInfo.email,'createdAt':timeNow})
				}); 
	    });
	});  


	$("#GET_BTN").click(function() {
		$.ajax(settings).done(function (response) {
			console.log(response);
		});
	});
	
});  

/*loginButton.onclick = function(){
	console.log("login button");
		chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
			chrome.identity.getProfileUserInfo(function(userInfo){
			  	$.ajax({
					url:'http://localhost:14080/user',
					dataType:'json',
					type:'post',
					success: function(data){
						console.log(data);
						chrome.storage.local.get('fcmid', function(result) {
							if(result['fcmid']){
						            sendFCM(result['fcmid']);
						            console.log('creating fcm');
						          }else{
						            var senderIds = ["828025514635"];
						            chrome.gcm.register(senderIds, afterFcm);
						          }
						      });
					},
					data:JSON.stringify({'token':token})
				});
		});
	});
}*/