chrome.runtime.onInstalled.addListener(function() {
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([{
			conditions: [new chrome.declarativeContent.PageStateMatcher({
				pageUrl: { urlContains: '' }
			})
			],
					actions: [new chrome.declarativeContent.ShowPageAction()]
		}]);
	});

	chrome.storage.sync.clear();
	chrome.storage.sync.set({myCustom : []}, null);

	chrome.contextMenus.create({
		id: 'startwb',
		title: 'Activate Webuffet',
		contexts: ['all']
	})
});

chrome.contextMenus.onClicked.addListener(function(info, tab) {
	if(info.menuItemId === 'startwb') {
		chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
			chrome.tabs.sendMessage(tabs[0].id, {msg: 'startwb'}, function(response) {});
		})
	}
})