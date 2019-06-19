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
				  }
  
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
	  });  
  
  
	  $("#GET_BTN").click(function() {
  
		  var strElem2=[];
		  var currul;
  
		  chrome.tabs.getSelected(null, function(tab) {
			  myFunction(tab.url);
		});
  
		  function myFunction(tablink) {
			  currul = tablink;
			  console.log(tablink);
		  }
  
		  $.ajax(settings).done(function (response) {
  
			  console.log(response);
  
			  var t = 0;
			  for(var i =0; i<response.data.length;i++){
				  for(var j=0; j<Object.keys(response.data[i].userTheme).length;j++){
					  strElem2.push(response.data[i].userTheme[j]);
				  }
			  }
  
			  console.log("save to sync storage");
			  chrome.storage.sync.set({ myCustom : strElem2 },function(){
				  chrome.tabs.query({status:'complete'}, (tabs)=>{
					  tabs.forEach((tab)=>{
							  if(tab.url){
									  chrome.tabs.update(tab.id,{url: tab.url});
							   }
							  });
					  });
			});
		});
	  });	
  });  
