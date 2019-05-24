import WBSession from "./WBSession"
import Ruler from "./Ruler"
import Thanos from "./lib/Thanos"
import EventCollector from "./EventCollector"

// Todo
// Preserve delete, resize, more buttons rotation

export default class WBApexTool {
  private apexToolElm: HTMLElement
  private removeBtn: HTMLElement
  private rotateBtn: HTMLElement
  private scaleBtn: HTMLElement
  private moreBtn: HTMLElement
  private readonly wbSession: WBSession
  private strElem: any[]

  private mode: undefined|'move'|'rotate'|'scale' = undefined
  private mouseOrigin: {
    x: number,
    y: number
  }

  private initialDistance: number
  private initialAngle: number
  private lastFinalScale: number
  private lastFinalRotate: number
  private lastFinalTranslate: {
    x: number,
    y: number
  }

  private eventCollector: EventCollector

  constructor(apexToolElm: HTMLElement, wbSession: WBSession) {
    this.apexToolElm = apexToolElm
    this.wbSession = wbSession
    this.strElem = []

    // Create event collector instance
    this.eventCollector = new EventCollector()

    // Store each button of apex tool
    this.removeBtn = this.apexToolElm.querySelector('.remove')
    this.rotateBtn = this.apexToolElm.querySelector('.rotate')
    this.scaleBtn = this.apexToolElm.querySelector('.scale')
    this.moreBtn = this.apexToolElm.querySelector('.more')

    // Save changes done before
    chrome.storage.sync.get(['myCustom'], items  => {
      if(items.myCustom[0] === {}) {
        
      } else {
        for(let key in items.myCustom) {
          this.strElem.push(items.myCustom[key])
        }
      }
    })

    // Add apex tool triggering event listener
    document.addEventListener('webuffetscan', this.start.bind(this))
  }

  // fires when mouse down
  private onMouseDown(e: MouseEvent) {
    if (this.wbSession.wbState !== 'apex') return
    
    this.mouseOrigin = {
      x: e.pageX,
      y: e.pageY
    }
    
    this.wbSession.clearRedo()
    this.lastFinalRotate = this.wbSession.getFinalState().rotate
    this.lastFinalScale = this.wbSession.getFinalState().scale
    this.lastFinalTranslate = this.wbSession.getFinalState().translate

    if (e.target instanceof HTMLElement) {
      if (e.target.closest('#wbc-editing-boundary .rotate')) {
        // rotation
        this.mode = 'rotate'
    
        const rect = this.wbSession.getSelectedElement().getBoundingClientRect()
        let R2D = 180 / Math.PI, center, x, y
        center = {
          x: rect.left + (rect.width / 2),
          y: rect.top + (rect.height / 2)
        }
        x = e.pageX - center.x
        y = e.pageY - center.y
        this.initialAngle = R2D * Math.atan2(y, x)
      } else if (e.target.closest('#wbc-editing-boundary .scale')) {
        // scaling
        this.mode = 'scale'
        let rect = this.wbSession.getSelectedElement().getBoundingClientRect()
        this.initialDistance = Ruler.getDistance(e.pageX, e.pageY, rect.left + rect.width/2, rect.top + rect.height/2)
      } else if (e.target.closest('#wbc-editing-boundary')) {
        this.mode = 'move'
      }
    }
  }

  // fires when mouse move
  private onMouseMove(e: MouseEvent) {
    if (!this.mode) return
    
    if (this.mode === 'scale') {
      let rect = this.wbSession.getSelectedElement().getBoundingClientRect()
      let distance = Ruler.getDistance(e.pageX, e.pageY, rect.left + rect.width/2, rect.top + rect.height/2)
      let newScale = distance / this.initialDistance * this.lastFinalScale
    
      let finalState = this.wbSession.getFinalState()
      this.wbSession.getSelectedElement().style.transform = Ruler.generateCSS(finalState.translate.x, finalState.translate.y, newScale, finalState.rotate)
    
      // stores final scale amount to the session
      this.wbSession.setFinal({
        scale: newScale
      })
    } else if (this.mode === 'rotate') {
      const rect = this.wbSession.getSelectedElement().getBoundingClientRect()
      let R2D = 180 / Math.PI, center, x, y, d
      center = {
        x: rect.left + (rect.width / 2),
        y: rect.top + (rect.height / 2)
      }
      x = e.pageX - center.x
      y = e.pageY - center.y
      d = R2D * Math.atan2(y, x)
      let newAngle = d - this.initialAngle + this.lastFinalRotate
      let finalState = this.wbSession.getFinalState()
      this.wbSession.getSelectedElement().style.transform = Ruler.generateCSS(finalState.translate.x, finalState.translate.y, finalState.scale, newAngle)
    
      // stores final roate angle to the session
      this.wbSession.setFinal({
        rotate: newAngle
      })
    } else if (this.mode === 'move') {
      let dx = e.pageX - this.mouseOrigin.x, dy = e.pageY - this.mouseOrigin.y
      let finalState = this.wbSession.getFinalState()
      this.wbSession.getSelectedElement().style.transform = Ruler.generateCSS(this.lastFinalTranslate.x + dx, this.lastFinalTranslate.y + dy, finalState.scale, finalState.rotate)

      // stores final translation state to the session
      this.wbSession.setFinal({
        translate: {
          x: this.lastFinalTranslate.x + dx,
          y: this.lastFinalTranslate.y + dy
        }
      })
    }
    
    this.setBoundingRectPos()
  }

  private onMouseUp(e: MouseEvent) {
    if (this.mode) this.mode = undefined
    this.wbSession.push()
  }

  private onKeyDown(e: KeyboardEvent) {
    // Escape ApexTool with no operations
    if(e.key == 'Escape') {
      this.stop()
      if(this.wbSession.getSelectedElement().style.transform.length > 0) {
        this.storage(false)
      }
      document.dispatchEvent(new CustomEvent('startselector'))
    }
    if (e.key === 'z' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if( this.wbSession.length() <= 1 ) return;
      this.wbSession.pop()
      this.wbSession.getSelectedElement().style.transform = Ruler.generateCSS(this.wbSession.getFinalState().translate.x, this.wbSession.getFinalState().translate.y, this.wbSession.getFinalState().scale, this.wbSession.getFinalState().rotate)
      this.setBoundingRectPos()
    }
    if (e.key === 'y' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      if( this.wbSession.redoLength() <= 0 ) return;
      this.wbSession.redo()
      this.wbSession.getSelectedElement().style.transform = Ruler.generateCSS(this.wbSession.getFinalState().translate.x, this.wbSession.getFinalState().translate.y, this.wbSession.getFinalState().scale, this.wbSession.getFinalState().rotate)
      this.setBoundingRectPos()
    }
  }

  // Start the ApexTool functioning
  public start() {
    // Show UI
    this.apexToolElm.classList.remove('wb-hidden')
    // Set UI's position
    this.setBoundingRectPos()
    // Set WEBuffet session's state to 'apex'
    this.wbSession.wbState = 'apex'
    
    // Add event listeners using EventCollector
    this.eventCollector.attachEvent(this.moreBtn, 'click', () => {
      this.stop()
      if(this.wbSession.getSelectedElement().style.transform.length > 0) {
        this.storage(false)
      }
      document.dispatchEvent(new CustomEvent('startselector'))
    })
    this.eventCollector.attachEvent(window, 'mousedown', this.onMouseDown.bind(this))
    this.eventCollector.attachEvent(window, 'mousemove', this.onMouseMove.bind(this))
    this.eventCollector.attachEvent(window, 'mouseup', this.onMouseUp.bind(this))
    ;['scroll', 'resize'].forEach(eventName => {
      this.eventCollector.attachEvent(window, eventName, this.setBoundingRectPos.bind(this))
    })
    this.eventCollector.attachEvent(window, 'keydown', this.onKeyDown.bind(this))
    this.eventCollector.attachEvent(this.removeBtn, 'click', this.remove.bind(this))
    this.wbSession.push()
  }

  public stop() {
    // Hide UI
    this.apexToolElm.classList.add('wb-hidden')
    // Set WEBuffet session's state to 'pending'
    this.wbSession.wbState = 'pending'
    // Remove all event listeners
    this.eventCollector.clearEvent()
  }

  // sets the position and the shape of ApexTool
  // based on the selected element
  private setBoundingRectPos() {
    const selectedElm = this.wbSession.getSelectedElement()
    const rect = selectedElm.getBoundingClientRect()
    const finalState = this.wbSession.getFinalState()

    // Set ApexTool's boundary position
    this.apexToolElm.style.left = rect.left + (rect.width - selectedElm.clientWidth) / 2 - (selectedElm.clientWidth * finalState.scale - selectedElm.clientWidth) / 2 + 'px'
    this.apexToolElm.style.top = rect.top + (rect.height - selectedElm.clientHeight) / 2 - (selectedElm.clientHeight * finalState.scale - selectedElm.clientHeight) / 2 + 'px'
    this.apexToolElm.style.width = selectedElm.clientWidth * finalState.scale  + 'px'
    this.apexToolElm.style.height = selectedElm.clientHeight * finalState.scale + 'px'
    this.apexToolElm.style.transform = 'rotate(' + Ruler.getRotationValue(selectedElm) + 'deg)'

    // Preserve buttons' horizontality
    // by rotating to oposite degrees
    this.removeBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.removeBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.rotateBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.rotateBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.removeBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.removeBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.moreBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.moreBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
  }

  // removes the selected element
  private remove() {
    // Stop ApexTool and go back to Selector after remove element
    this.stop()
    this.storage(true)

    if (this.wbSession.isThanos) {
      Thanos.snapFingers(this.wbSession.getSelectedElement())
      document.dispatchEvent(new CustomEvent('consolestop'))
    } else {
      this.wbSession.getSelectedElement().style.display = 'none'
      document.dispatchEvent(new CustomEvent('startselector'))
    }
  }

  private storage(display : boolean) {
    let tempIndex: number
    let tempCName: string
    let isReplaced: boolean = false

    if(this.wbSession.getSelectedElement().tagName == 'DIV') {
      tempIndex = Array.from(document.getElementsByTagName('DIV')).indexOf(this.wbSession.getSelectedElement()) - document.querySelector('#webuffet-components').querySelectorAll(this.wbSession.getSelectedElement().tagName).length - 1
    } else if (this.wbSession.getSelectedElement().tagName == 'SPAN') {
      tempIndex = Array.from(document.getElementsByTagName('SPAN')).indexOf(this.wbSession.getSelectedElement()) - document.querySelector('#webuffet-components').querySelectorAll(this.wbSession.getSelectedElement().tagName).length
    } else {
      tempIndex = Array.from(document.getElementsByTagName(this.wbSession.getSelectedElement().tagName)).indexOf(this.wbSession.getSelectedElement())
    }
    if(this.wbSession.getSelectedElement().className.includes(' ') == true) {
      tempCName = ""
    } else {
      tempCName = this.wbSession.getSelectedElement().className
    }

    for(let i = 0; i < this.strElem.length; i++) {
      if(((this.strElem[i].name.id != "" && document.getElementById(this.strElem[i].name.id) === this.wbSession.getSelectedElement()) ||
      (this.strElem[i].name.cName != "" && document.getElementsByClassName(this.strElem[i].name.cName).item(this.strElem[i].name.cIndex) === this.wbSession.getSelectedElement()) ||
      document.getElementsByTagName(this.strElem[i].name.tName).item(this.strElem[i].name.tIndex) === document.getElementsByTagName(this.wbSession.getSelectedElement().tagName).item(tempIndex)) &&
      this.strElem[i].url === document.URL) {
        this.strElem.splice(i, 1, {
          url: document.URL,
          name:
            {
              id: this.wbSession.getSelectedElement().id,
              cName: tempCName,
              cIndex: Array.from(document.getElementsByClassName(this.wbSession.getSelectedElement().className)).indexOf(this.wbSession.getSelectedElement()),
              tName: this.wbSession.getSelectedElement().tagName,
              tIndex: tempIndex
            },
          style :
            {
              isDeleted : display,
              translatex : this.wbSession.getFinalState().translate.x,
              translatey : this.wbSession.getFinalState().translate.y,
              rotate : this.wbSession.getFinalState().rotate,
              scale : this.wbSession.getFinalState().scale
            }
        })
        isReplaced = true
      }
    }
    if(isReplaced != true) {
      this.strElem.push(
        /**
         * Push new element to WBApexTool.strElem : any[]
         * All array of strElem will be stored in chrome.storage.sync
         * It will be loaded after window.onload
         */
        {
          url: document.URL,
          name:
            {
              id: this.wbSession.getSelectedElement().id,
              cName: tempCName,
              cIndex: Array.from(document.getElementsByClassName(this.wbSession.getSelectedElement().className)).indexOf(this.wbSession.getSelectedElement()),
              tName: this.wbSession.getSelectedElement().tagName,
              tIndex: tempIndex
            },
          style :
            {
              isDeleted : display,
              translatex : this.wbSession.getFinalState().translate.x,
              translatey : this.wbSession.getFinalState().translate.y,
              rotate : this.wbSession.getFinalState().rotate,
              scale : this.wbSession.getFinalState().scale
            }
        }
      )
    }
    this.addImgSrc()
    /**
     *  Save strElem to chrome.storage.sync
     */
    chrome.storage.sync.set({ myCustom : this.strElem }, null)
  }

  private addImgSrc() {
    if(document.getElementById('webuffet-image-sources') != null) {
      let captures: Array<String> = JSON.parse(document.querySelector('#webuffet-image-sources').getAttribute('data'))
      if(captures == null) {
        captures = []
        chrome.storage.sync.get(['myCustom'], item => {
          for(let i = 0; i < item.myCustom.length; i++) {
            if(item.myCustom[i].url != document.URL) {
              captures.push(item.myCustom[i].name.id)
            } else break
          }
          captures.push(this.wbSession.getOriginalState().imgSrc)
          document.body.removeChild(document.getElementById('webuffet-image-sources'))
          let srcElm = document.createElement('div')
          srcElm.id = 'webuffet-image-sources'
          srcElm.setAttribute('data', JSON.stringify(captures))
          document.body.appendChild(srcElm)
        })
      } else {
        chrome.storage.sync.get(['myCustom'], item => {
          captures.push(this.wbSession.getOriginalState().imgSrc)
          document.body.removeChild(document.getElementById('webuffet-image-sources'))
          let srcElm = document.createElement('div')
          srcElm.id = 'webuffet-image-sources'
          srcElm.setAttribute('data', JSON.stringify(captures))
          document.body.appendChild(srcElm)
        })
      }
    } else {
      let captures: Array<string> = []
      captures[0] = this.wbSession.getOriginalState().imgSrc
      let srcElm = document.createElement('div')
      srcElm.id = 'webuffet-image-sources'
      srcElm.setAttribute('data', JSON.stringify(captures))
      document.body.appendChild(srcElm)
    }
  }
}