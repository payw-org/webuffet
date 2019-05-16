import Ruler from "./Ruler"

let html = document.querySelector('html')
html.style.display = 'none'

/**
 * Codes read from chrome.storage.sync
 * Attach Style Sheet from read elements
 */

let objects : any [] = []

chrome.storage.sync.get(['myCustom'], function(items) {
    for(let key in items.myCustom) {
        console.log(items.myCustom[key].name)
        objects.push(JSON.parse(JSON.stringify(items.myCustom[key])))
    }
})

console.log(objects[0])
let job = function() {
    for (let idx in objects) {
        let item = objects[idx]
        document.getElementById(item.name.id).style.transform = Ruler.generateCSS(item.style.translatex, item.style.translatey, item.style.scale, item.style.rotate)
    }
}

html.style.display = ''