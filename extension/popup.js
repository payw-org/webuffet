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

	var strElem1 = [];

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

			chrome.storage.sync.get(['myCustom'], items  => {
				if(items.myCustom[0] === {}) {
					
				} else {
					for(let key in items.myCustom) {
						strElem1.push(items.myCustom[key]);
					}
					console.dir(strElem1);
				}
			});
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
					"data":JSON.stringify({'userID':userInfo.id,'userEmail':userInfo.email,'userTheme':strElem1,'createdAt':timeNow})
				}); 
	    });
	});  


	$("#GET_BTN").click(function() {

		var strElem2=[];

		$.ajax(settings).done(function (response) {
			console.log(response);
			console.dir(response.data[0].userTheme[0]);
			console.dir(Object.keys(response.data[0].userTheme).length);

			for(var i = 0; i < Object.keys(response.data[0].userTheme).length; i++){
				strElem2.push(response.data[0].userTheme[i]);
			}

			chrome.storage.sync.set({ myCustom : strElem2 },null);
		});

		chrome.tabs.getSelected(null, function(tab) {
			chrome.tabs.reload(tab.id);
	});
	});	
});  