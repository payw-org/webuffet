import Ruler from "./Ruler"
import html2canvas from 'html2canvas'

let body = document.querySelector('html')
body.style.opacity = '0'
body.getBoundingClientRect().height

/**
 * Codes read from chrome.storage.sync
 * Attach Style Sheet from read elements
 */
window.onload = () => {
    let body = document.querySelector('html')

    chrome.storage.sync.get(['myCustom'], items => {
        /**
        * Here, Attach Style Sheet from object in items
        * Get URL first, check the URL matches with document.URL
        * If matches, find elements in document with name and generate CSS for that element with style
        */

        try {
            if(!items.myCustom[0]) {
                body.style.opacity = '1'
                return
            }

            else {
                let srcElm = document.createElement('div')
                srcElm.id = 'webuffet-image-sources'
                document.body.appendChild(srcElm)
                let imgSrcArr: Array<String> = []

                let processElement = function (items: any, i: number) {
                    if (i == items.myCustom.length) {
                        // body.style.transform = ''
                        body.style.opacity = '1'
                        return
                    }
                    let num : number = i
                    let item = items.myCustom[i]
                    let element: HTMLElement
                    if(item.url != document.URL) {
                        if (i > items.myCustom.length - 1) {
                            body.style.opacity = '1'
                        }
                        imgSrcArr.push('null')
                        srcElm.setAttribute('data', JSON.stringify(imgSrcArr))
                        processElement(items, i+1)
                        return
                    }


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
                        imgSrcArr[num] = canvas.toDataURL('image/png')
                        srcElm.setAttribute('data', JSON.stringify(imgSrcArr))
                        if(item.style.isDeleted == true) {
                            element.style.display = 'none'
                        } else {
                            element.style.transform = Ruler.generateCSS(item.style.translatex, item.style.translatey, item.style.scale, item.style.rotate)
                        }
                        if(i > items.myCustom.length - 1) {
                            body.style.opacity = '1'
                        }

                        processElement(items, i + 1)
                    })
                }

                processElement(items, 0)
            }
        } finally {
            body.style.opacity = '1'
        }
    })
}