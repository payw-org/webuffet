import Ruler from "./Ruler"

let body = document.querySelector('html')
body.style.visibility = 'hidden'

/**
 * Codes read from chrome.storage.sync
 * Attach Style Sheet from read elements
 */
window.onload = () => {
    let body = document.querySelector('html')
    chrome.storage.sync.get(['myCustom'], function(items) {
        /**
        * Here, Attach Style Sheet from object in items
        * Get URL first, check the URL matches with document.URL
        * If matches, find elements in document with name and generate CSS for that element with style
        */
        if(items.myCustom[0] === {}) return
        else {
            for(let key in items.myCustom) {
                let item = items.myCustom[key]
                if(item.name.id != "") {
                    if(item.style.isDeleted == true) {
                        document.getElementById(item.name.id).style.display = 'none'
                    } else {
                        document.getElementById(item.name.id).style.transform = Ruler.generateCSS(item.style.translatex, item.style.translatey, item.style.scale, item.style.rotate)
                    }   
                }  else if(item.name.cName != "") {
                    let element : any = document.getElementsByClassName(item.name.cName).item(Number(item.name.cIndex))
                    if(item.style.isDeleted == true) {
                        element.style.display = 'none'
                    } else {
                        element.style.transform = Ruler.generateCSS(item.style.translatex, item.style.translatey, item.style.scale, item.style.rotate)
                    }
                } else {
                    let element : any = document.getElementsByTagName(item.name.tName).item(item.name.tIndex)
                    console.log(element)
                    if(item.style.isDeleted == true) {
                        element.item(0).style.display = 'none'
                    } else {
                        element.style.transform = Ruler.generateCSS(item.style.translatex, item.style.translatey, item.style.scale, item.style.rotate)
                    }
                }
            }
        }
    })
    body.style.visibility = 'visible'
}