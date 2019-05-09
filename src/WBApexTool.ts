import WBSession from "./WBSession"
import Ruler from "./Ruler"
import Thanos from "./lib/Thanos"

// Todo
// Preserve delete, resize, more buttons rotation

export default class WBApexTool {
  private apexToolElm: HTMLElement
  private removeBtn: HTMLElement
  private rotateBtn: HTMLElement
  private scaleBtn: HTMLElement
  private moreBtn: HTMLElement
  private readonly wbSession: WBSession

  private mode: undefined|'move'|'rotate'|'scale' = undefined
  private mouseOrigin: {
    x: number,
    y: number
  }

  private initialDistance: number
  private initialAngle: number
  private lastFinalScale: number
  private lastFinalRoate: number

  constructor(apexToolElm: HTMLElement, wbSession: WBSession) {
    this.apexToolElm = apexToolElm
    this.wbSession = wbSession

    // Store each button of apex tool
    this.removeBtn = this.apexToolElm.querySelector('.remove')
    this.rotateBtn = this.apexToolElm.querySelector('.rotate')
    this.scaleBtn = this.apexToolElm.querySelector('.scale')
    this.moreBtn = this.apexToolElm.querySelector('.more')

    // Add event listeners
    this.removeBtn.addEventListener('click', e => {
      Thanos.snapFingers(this.wbSession.getSelectedElement())
      this.stop()
    })

    document.addEventListener('webuffetscan', this.onScanned.bind(this))
    window.addEventListener('mousedown', this.onMouseDown.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    window.addEventListener('mouseup', this.onMouseUp.bind(this))
    ;['scroll', 'resize'].forEach(eventName => {
      window.addEventListener(eventName, this.setBoundingRectPos.bind(this))
    })
  }

  private onMouseDown(e: MouseEvent) {
    if (this.wbSession.wbState !== 'apex') return
    
    this.mouseOrigin = {
      x: e.pageX,
      y: e.pageY
    }
    
    this.lastFinalRoate = this.wbSession.getFinalState().rotate
    this.lastFinalScale = this.wbSession.getFinalState().scale
    
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
        this.initialDistance = Ruler.getDistance(e.pageX, e.pageY, this.wbSession.getFinalState().coordinate.x, this.wbSession.getFinalState().coordinate.y)
      } else if (e.target.closest('#wbc-editing-boundary')) {
        this.mode = 'move'
      }
    }
  }

  private onMouseMove(e: MouseEvent) {
    if (!this.mode) return
    
    if (this.mode === 'scale') {
      let distance = Ruler.getDistance(e.pageX, e.pageY, this.wbSession.getOriginalState().coordinate.x, this.wbSession.getOriginalState().coordinate.y)
      let newScale = distance / this.initialDistance * this.lastFinalScale
    
      this.wbSession.getSelectedElement().style.transform = 'rotate(' + this.lastFinalRoate + 'deg) scale(' + newScale + ')'
    
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
      let newAngle = d - this.initialAngle + this.lastFinalRoate
      this.wbSession.getSelectedElement().style.transform = 'rotate(' + newAngle + 'deg) scale(' + this.lastFinalScale + ')'
    
      this.wbSession.setFinal({
        rotate: newAngle
      })
    } else if (this.mode === 'move') {
      
    }
    
    this.setBoundingRectPos()
  }

  private onMouseUp(e: MouseEvent) {
    if (this.mode) this.mode = undefined
  }

  private onScanned() {
    this.start()
  }

  public start() {
    this.apexToolElm.classList.remove('wb-hidden')
    this.setBoundingRectPos()
    this.wbSession.wbState = 'apex'
  }

  public stop() {
    this.apexToolElm.classList.add('wb-hidden')
    this.wbSession.wbState = 'pending'
  }

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
    // this.moreBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    // this.moreBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
  }
}