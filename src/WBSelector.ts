import WBSession from './WBSession'
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
    window.addEventListener('mousemove', this.onMouseMove.bind(this))
    window.addEventListener('mouseover', this.onMouseOver.bind(this))
    window.addEventListener('keydown', this.onKeyDown.bind(this))

    this.progressBarElm.addEventListener('transitionend', () => {
      this.stop()
      this.wbSession.setOriginal(this.hoverElm)

      document.dispatchEvent(new CustomEvent('webuffetscan'))
    })

    document.addEventListener('startselector', this.start.bind(this))
  }

  private detachEventListeners() {
    window.removeEventListener('mousemove', this.onMouseMove.bind(this))
    window.removeEventListener('mouseover', this.onMouseOver.bind(this))
    window.removeEventListener('keydown', this.onKeyDown.bind(this))
  }

  private onMouseMove(e: MouseEvent) {
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

  private onKeyDown(e: KeyboardEvent) {
    if (this.wbSession.wbState !== 'select') return
    
    if (e.key === 'Escape') {
      this.detachEventListeners()
      this.stop()
      document.dispatchEvent(new CustomEvent('loadconsole'))
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
    this.attachEventListeners()
  }

  private stop() {
    this.progressBarElm.classList.remove('expand')
    this.selectorElm.classList.add('wb-hidden')
    this.wbSession.wbState = 'pending'
  }
}