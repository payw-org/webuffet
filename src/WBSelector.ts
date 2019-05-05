import WBSession from "./WBSession"

export default class WBSelector {
  private selectorElm: HTMLElement
  private readonly wbSession: WBSession
  private mouseMoveTimeout: number
  private triggerTimeout: number
  private progressBarDom: HTMLElement
  private hoverElm: HTMLElement
  private isScanCompleteSet: boolean = false

  constructor(selectorElm: HTMLElement, wbSession: WBSession) {
    this.selectorElm = selectorElm
    this.wbSession = wbSession
    this.progressBarDom = this.selectorElm.querySelector('#wbc-progress-bar')

    // Event Listeners
    window.addEventListener('mouseover', e => {
      if (this.wbSession.wbState === 'select' && e.target instanceof HTMLElement) {
        this.hoverElm = e.target
        this.setBoundingRectPos()
      }
    })

    window.addEventListener('mousedown', e => {
      this.triggerTimeout = window.setTimeout(() => {
        if (e.target instanceof HTMLElement) {
          this.hoverElm = e.target
          this.setBoundingRectPos()
        }
        this.start()
      }, 1000)
    })

    window.addEventListener('mouseup', e => {
      window.clearTimeout(this.triggerTimeout)
    })

    // When stop moving a pointer,
    // scanning effect starts after an interval.
    window.addEventListener('mousemove', e => {
      clearTimeout(this.triggerTimeout)

      if (this.wbSession.wbState === 'select') {
        this.startScanning()
      }
    })
  }

  private startScanning() {
    this.progressBarDom.classList.remove('expand')
    clearTimeout(this.mouseMoveTimeout)
    this.mouseMoveTimeout = window.setTimeout(() => {
      this.progressBarDom.classList.add('expand')
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
    if (!this.isScanCompleteSet) {
      console.error('whenScanningCompleted method is not set!')
      return
    }

    if (this.wbSession.wbState !== 'pending') {
      return
    }

    this.selectorElm.classList.remove('hidden')
    this.wbSession.wbState = 'select'
  }

  private stop() {
    this.selectorElm.classList.add('hidden')
    this.wbSession.wbState = 'pending'
  }

  whenScanningCompleted(switchMode: Function) {
    this.isScanCompleteSet = true

    this.progressBarDom.addEventListener('transitionend', () => {
      this.wbSession.setOriginal(this.hoverElm)
      this.stop()
      switchMode()
    })
  }
}