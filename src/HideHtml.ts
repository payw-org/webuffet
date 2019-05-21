import Ruler from "./Ruler"
import html2canvas from 'html2canvas'

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
            let srcElm = document.createElement('div')
            srcElm.id = 'webuffet-image-sources'
            let imgSrcArr: Array<string> = []
            document.body.appendChild(srcElm)
            for(let key in items.myCustom) {
                let item = items.myCustom[key]
                let element
                if(item.url != document.URL) continue;
                
                if(item.name.id != "") {
                    element = document.getElementById(item.name.id)
                } else if(item.name.cName != "") {
                    element = document.getElementsByClassName(item.name.cName).item(item.name.cIndex) as HTMLElement
                } else {
                    element = document.getElementsByTagName(item.name.tName).item(item.name.tIndex) as HTMLElement
                }
                html2canvas(element, {
                    useCORS: true,
                    backgroundColor: null,
                  }).then((canvas: HTMLCanvasElement) => {
                    imgSrcArr.push(canvas.toDataURL('image/png'))
                    srcElm.setAttribute('data', JSON.stringify(imgSrcArr))
                })

                if(item.style.isDeleted == true) {
                    element.style.display = 'none'
                } else {
                    element.style.transform = Ruler.generateCSS(item.style.translatex, item.style.translatey, item.style.scale, item.style.rotate)
                }   
            }
        }
    })
    body.style.visibility = 'visible'
}