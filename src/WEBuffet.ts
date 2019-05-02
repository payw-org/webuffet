import Ruler from './Ruler'
import WBStorage from './WBStorage'
import WBSelector from './WBSelector'

export default class WEBuffet {
  private readonly wbStorage: WBStorage
  private readonly wbSelector: WBSelector
  longPressTimeout: number
  mouseMoveTimeout: number
  domSelected: boolean
  selectedTarget: HTMLElement
  selectedTargetInfo: {
    id: string
    classNames: string[]
    transformData: {
      translateX: number
      translateY: number
    }
  }
  wbDom: HTMLElement
  wbComponents: HTMLElement
  wbSelectorDom: HTMLElement
  wbProgressBar: HTMLElement
  wbEditingBoundary: HTMLElement
  isWebuffetActive: boolean = false
  isEditingMode: boolean = false
  isSelectingMode: boolean = false
  isStartMoving: boolean = false
  originX: number
  originY: number
  defaultTransVal: {
    left?: number
    top?: number
    scale?: number
    rotate?: number
  }
  lastHighestZIndex: number = 1147483646
  dragMode: string
  originalWidth: number
  originalScale: number
  startAngle: number

  constructor() {
    require('./scss/webuffet.scss')

    this.domSelected = false
    this.wbDom = undefined
    this.selectedTarget = undefined

    let componentHTML = require('./templates/webuffet.html')
    this.wbComponents = new DOMParser().parseFromString(componentHTML, 'text/html').querySelector('#webuffet-components')
    document.body.insertBefore(this.wbComponents, document.body.firstChild)
    this.wbSelectorDom = this.wbComponents.querySelector('#wbc-selector')
    this.wbProgressBar = this.wbComponents.querySelector('#wbc-progress-bar')
    this.wbProgressBar.addEventListener('transitionend', e => {
      this.endSelectingMode()
      this.startEditingMode()
    })

    this.wbEditingBoundary = this.wbComponents.querySelector('#wbc-editing-boundary')

    this.addListeners()


    this.wbStorage = new WBStorage()
    this.wbSelector = new WBSelector(this.wbComponents.querySelector('#wbc-selector'), this.wbStorage)
  }

  setRectPos(
    target: HTMLElement,
    top: number,
    left: number,
    width?: number,
    height?: number
  ) {
    if (width) {
      target.style.width = width + 'px'
    }
    if (height) {
      target.style.height = height + 'px'
    }

    target.style.left = left + 'px'
    target.style.top = top + 'px'
  }

  adjustToolPosition() {
    if (!this.selectedTarget) return

    this.setRectPos(this.wbSelectorDom,
      this.selectedTarget.getBoundingClientRect().top,
      this.selectedTarget.getBoundingClientRect().left,
      this.selectedTarget.getBoundingClientRect().width,
      this.selectedTarget.getBoundingClientRect().height)
    
    this.setRectPos(this.wbEditingBoundary,
      this.selectedTarget.getBoundingClientRect().top,
      this.selectedTarget.getBoundingClientRect().left,
      this.selectedTarget.clientWidth,
      this.selectedTarget.clientHeight)
  }

  startSelectingMode() {
    this.isSelectingMode = true
    this.isWebuffetActive = true
    document.body.classList.add('webuffet-active')
    this.wbSelectorDom.classList.remove('hidden')

    // Set iframes unclickable
    document.querySelectorAll('iframe').forEach(item => {
      item.style.pointerEvents = 'none'
    })
  }

  endSelectingMode(reset: boolean = false) {
    this.isSelectingMode = false
    this.isWebuffetActive = false
    this.wbSelectorDom.classList.add('hidden')
    this.wbProgressBar.classList.remove('expand')

    if (reset) {
      this.setRectPos(this.wbSelectorDom, -100, -100, 0, 0)
    }
  }

  startEditingMode() {
    this.isEditingMode = true
    this.isWebuffetActive = true
    this.wbEditingBoundary.classList.remove('hidden')

    if (!this.selectedTarget) return

    this.selectedTarget.style.position = 'relative'
    this.selectedTarget.style.zIndex = String(this.lastHighestZIndex++)
    
    // Set editing boundary around the selected dom
    this.setRectPos(this.wbEditingBoundary,
      this.selectedTarget.getBoundingClientRect().top,
      this.selectedTarget.getBoundingClientRect().left,
      this.selectedTarget.getBoundingClientRect().width,
      this.selectedTarget.getBoundingClientRect().height)
    
    this.isEditingMode = true
  }

  endEditingMode() {
    this.isEditingMode = false
    this.isWebuffetActive = false
    this.wbEditingBoundary.classList.add('hidden')
    this.startSelectingMode()
    this.wbEditingBoundary.style.transform = ''
  }

  clearAllMode() {
    this.endSelectingMode()
    this.endEditingMode()
  }

  onMouseOver(e: MouseEvent) {
    if (this.domSelected) return
    
    if (this.isSelectingMode) {
      if (e.target instanceof HTMLElement) {
        this.selectedTarget = e.target
        this.setRectPos(this.wbSelectorDom,
          this.selectedTarget.getBoundingClientRect().top,
          this.selectedTarget.getBoundingClientRect().left,
          this.selectedTarget.getBoundingClientRect().width,
          this.selectedTarget.getBoundingClientRect().height)
      }
    }
  }

  onMouseDown(e: MouseEvent) {
    if (e.button !== 0) return

    if (e.target instanceof HTMLElement) {
      if (this.isWebuffetActive) {
        this.originX = e.pageX
        this.originY = e.pageY
        this.defaultTransVal = {
          left: 0,
          top: 0,
          scale: Ruler.getScaleXY(this.selectedTarget).x,
          rotate: Ruler.getRotationValue(this.selectedTarget)
        }
        if (this.selectedTarget.style.left) {
          this.defaultTransVal.left = parseInt(this.selectedTarget.style.left)
        }
        if (this.selectedTarget.style.top) {
          this.defaultTransVal.top = parseInt(this.selectedTarget.style.top)
        }
        console.log(this.defaultTransVal)
        this.originalWidth = this.selectedTarget.getBoundingClientRect().width
        this.originalScale = Ruler.getScaleXY(this.selectedTarget).x
        this.selectedTarget.style.transformOrigin = '50% 50%';

        if (e.target.closest('.wbc-handle.right-bottom')) {
          console.log('start scaliing')
          this.isStartMoving = true
          this.dragMode = 'scaling'
        } else if (e.target.closest('.wbc-handle.right-top')) {
          console.log('start rotating')
          this.isStartMoving = true
          this.dragMode = 'rotating'

          let R2D = 180 / Math.PI, left, top, width, height, center, x, y
          left = this.selectedTarget.getBoundingClientRect().left
          top = this.selectedTarget.getBoundingClientRect().top
          width = this.selectedTarget.getBoundingClientRect().width
          height = this.selectedTarget.getBoundingClientRect().height
          center = {
            x: left + (width / 2),
            y: top + (height / 2)
          }
          x = e.pageX - center.x
          y = e.pageY - center.y
          this.startAngle = R2D * Math.atan2(y, x)
        } else if (e.target.closest('#wbc-editing-boundary')) {
          console.log('start moving')
          this.isStartMoving = true
          this.dragMode = 'moving'
        } else {
          if (this.isEditingMode) {
            this.endEditingMode()
          }
        }
      } else {
        this.longPressTimeout = window.setTimeout(() => {
          this.startSelectingMode()
          this.onMouseOver(e)
          this.onMouseMove(e)
        }, 1000)
      }
    }
  }

  onMouseMove(e: MouseEvent) {
    clearTimeout(this.longPressTimeout)
    
    if (this.isSelectingMode) {
      clearTimeout(this.mouseMoveTimeout)
      this.wbProgressBar.classList.remove('expand')
      
      this.mouseMoveTimeout = window.setTimeout(() => {
        this.wbProgressBar.classList.add('expand')
      }, 700)
    }

    if (this.isEditingMode) {
      if (this.isStartMoving) {
        let deltaX = e.pageX - this.originX
        let deltaY = e.pageY - this.originY

        if (this.dragMode == 'moving') {
          this.selectedTarget.style.left = this.defaultTransVal.left + deltaX + 'px'
          this.selectedTarget.style.top = this.defaultTransVal.top + deltaY + 'px'
          
          this.adjustToolPosition()
        } else if (this.dragMode == 'scaling') {
          let scaleVal = (this.originalWidth + 2 * deltaX) / this.originalWidth
          let transformString = 'scale(' + scaleVal * this.originalScale + ')' + ' rotate(' + this.defaultTransVal.rotate + 'deg)'
          this.selectedTarget.style.transform = transformString
          this.adjustToolPosition()
        } else if (this.dragMode = 'rotating') {
          let R2D = 180 / Math.PI, left, top, width, height, center, x, y, d, rotation
          left = this.selectedTarget.getBoundingClientRect().left
          top = this.selectedTarget.getBoundingClientRect().top
          width = this.selectedTarget.getBoundingClientRect().width
          height = this.selectedTarget.getBoundingClientRect().height
          center = {
            x: left + (width / 2),
            y: top + (height / 2)
          }
          x = e.pageX - center.x
          y = e.pageY - center.y
          d = R2D * Math.atan2(y, x)
          rotation = d - this.startAngle + this.defaultTransVal.rotate
          let transformString = 'rotate(' + rotation + 'deg)' + ' scale(' + this.defaultTransVal.scale + ')'
          console.log(transformString)
          this.selectedTarget.style.transform = transformString
          this.wbEditingBoundary.style.transform = 'rotate(' + rotation + 'deg)'
          console.log('rotation: ', rotation)
        }
      }
    }
  }

  addListeners() {
    window.addEventListener('mouseover', (e) => { this.onMouseOver(e) })
    window.addEventListener('mousemove', e => { this.onMouseMove(e) })
    window.addEventListener('mousedown', e => { this.onMouseDown(e) })

    window.addEventListener('dragstart', e => {
      e.preventDefault()
    })

    window.addEventListener('click', e => {
      if (e.target instanceof HTMLElement) {
        if (e.target.closest('.wbc-handle.delete')) {
          this.remove()
        }
      }
    })

    window.addEventListener('mouseup', e => {
      clearTimeout(this.longPressTimeout)
      this.isStartMoving = false
      // this.selectedTarget.style.zIndex = ''
    })

    ;['resize', 'scroll'].forEach(eventName => {
      window.addEventListener(eventName, e => {
        this.adjustToolPosition()
      })
    })

    window.addEventListener('keydown', e => {
      // e.preventDefault()
      if (e.key === 'Escape') {
        if (this.isEditingMode) {
          this.endEditingMode()
          this.startSelectingMode()
        } else if (this.isSelectingMode) {
          this.endSelectingMode(true)
        }
      } else if (e.key === 'Backspace') {
        if (this.isEditingMode) {
          this.remove()
        }
      }
    })
  }

  remove() {
    if (!this.isEditingMode) return
    if (!this.selectedTarget) return
    this.selectedTarget.style.display = 'none'
    this.endEditingMode()
  }
}