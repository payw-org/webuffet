import WBSession from './WBSession'
import ScannedEvent from './interfaces/events/ScannedEvent'
import html2canvas from 'html2canvas'

export default class WBSelector {
  private selectorElm: HTMLElement
  private progressBarElm: HTMLElement
  private hoverElm: HTMLElement
  private readonly wbSession: WBSession
  private mouseMoveTimeout: number
  private triggerTimeout: number

  constructor(selectorElm: HTMLElement, wbSession: WBSession) {
    this.selectorElm = selectorElm
    this.wbSession = wbSession
    this.progressBarElm = this.selectorElm.querySelector('#wbc-progress-bar')

    this.attachEventListeners()
  }

  private attachEventListeners() {
    window.addEventListener('mouseover', this.onMouseOver.bind(this))
    window.addEventListener('mousedown', this.onMouseDown.bind(this))
    window.addEventListener('mouseup', this.onMouseUp.bind(this))
    window.addEventListener('mousemove', this.onMouseMove.bind(this))

    this.progressBarElm.addEventListener('transitionend', () => {
      this.stop()
      this.wbSession.setOriginal(this.hoverElm)

      let e: ScannedEvent = new CustomEvent(
        'scanned',
        {
          detail: {
            target: this.hoverElm
          },
          bubbles: false,
          cancelable: false
        }
      )

      document.dispatchEvent(e)
    })
  }

  private onMouseDown(e: MouseEvent) {
    this.triggerTimeout = window.setTimeout(() => {
      if (e.target instanceof HTMLElement) {
        this.hoverElm = e.target
        this.setBoundingRectPos()
      }
      this.start()
    }, 1000)
  }

  private onMouseUp(e: MouseEvent) {
    window.clearTimeout(this.triggerTimeout)
  }

  private onMouseMove(e: MouseEvent) {
    clearTimeout(this.triggerTimeout)
    
    if (this.wbSession.wbState === 'select') {
      this.startScanning()
    }
  }

  private onMouseOver(e: MouseEvent) {
    if (this.wbSession.wbState === 'select' && e.target instanceof HTMLElement) {
      this.hoverElm = e.target
      this.setBoundingRectPos()
    }
  }

  private startScanning() {
    this.progressBarElm.classList.remove('expand')
    clearTimeout(this.mouseMoveTimeout)
    this.mouseMoveTimeout = window.setTimeout(() => {
      this.progressBarElm.classList.add('expand')
      // html2canvas(this.hoverElm, {
      //   useCORS: true,
      //   backgroundColor: null
      // }).then(function (canvas: HTMLCanvasElement) {
      //   let img = canvas.toDataURL('image/png')
      //   document.write('<img src="' + img + '" />')
      // })
    }, 700)
  }

  private setBoundingRectPos() {
    const rect = this.hoverElm.getBoundingClientRect()
    this.selectorElm.style.left = rect.left + 'px'
    this.selectorElm.style.top = rect.top + 'px'
    this.selectorElm.style.width = rect.width + 'px'
    this.selectorElm.style.height = rect.height + 'px'
  }

  private start() {
    if (this.wbSession.wbState !== 'pending') {
      return
    }

    this.selectorElm.classList.remove('wb-hidden')
    this.wbSession.wbState = 'select'
  }

  private stop() {
    this.selectorElm.classList.add('wb-hidden')
    this.wbSession.wbState = 'pending'
  }
}