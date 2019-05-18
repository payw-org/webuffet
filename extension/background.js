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
});