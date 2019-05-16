let html = document.querySelector('html')
html.style.display = 'none'

/**
 * Codes read from chrome.storage.sync
 * Attach Style Sheet from read elements
 */

chrome.storage.sync.get(['myCustom'], function(items) {
    /**
     * Here, Attach Style Sheet from object in items
     * Get URL first, check the URL matches with document.URL
     * If matches, find elements in document with name and generate CSS for that element with style
     */
    if(items.myCustom[0] === []) {
        return
    } else {
        for (idx in items.myCustom) {
            console.log(items.myCustom[idx].name)
        }
    }
    console.log(items)
})

html.style.display = ''