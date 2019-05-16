import WBSession from './WBSession'
import html2canvas from 'html2canvas'
import EventCollector from './EventCollector'

export default class WBSelector {
  private selectorElm: HTMLElement
  private progressBarElm: HTMLElement
  private hoverElm: HTMLElement
  private readonly wbSession: WBSession
  private mouseMoveTimeout: number
  private triggerTimeout: number
  private eventCollector: EventCollector
  private bartime = 700

  constructor(selectorElm: HTMLElement, wbSession: WBSession) {
    this.selectorElm = selectorElm
    this.wbSession = wbSession
    this.progressBarElm = this.selectorElm.querySelector('#wbc-progress-bar')
    this.eventCollector = new EventCollector()

    document.addEventListener('startselector', this.start.bind(this))
    document.addEventListener('increasetime', ((event: CustomEvent) => {
      this.bartime += 100
    }) as EventListener);
    document.addEventListener('decreasetime', ((event: CustomEvent) => {
      if(this.bartime>300){
        this.bartime -= 100
      }
    }) as EventListener);
  }

  private attachEventListeners() {
    this.eventCollector.attachEvent(window, 'mousemove', this.onMouseMove.bind(this))
    this.eventCollector.attachEvent(window, 'mouseover', this.onMouseOver.bind(this))
    this.eventCollector.attachEvent(window, 'keydown', this.onKeyDown.bind(this))
    this.eventCollector.attachEvent(this.progressBarElm, 'transitionend', () => {
      this.stop()
      this.wbSession.setOriginal(this.hoverElm)

      document.dispatchEvent(new CustomEvent('webuffetscan'))
    })
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
      this.stop()
      document.dispatchEvent(new CustomEvent('loadconsole'))
    }
  }

  private startScanning() {
    this.progressBarElm.classList.remove('expand')
    this.progressBarElm.style.transition = 'transform 20ms linear'
    clearTimeout(this.mouseMoveTimeout)
    let time=1
    this.mouseMoveTimeout = window.setTimeout(() => {
      this.progressBarElm.style.transition = 'transform '+this.bartime+'ms linear'
      this.progressBarElm.classList.add('expand')
      // html2canvas(this.hoverElm, {
      //   useCORS: true,
      //   backgroundColor: null
      // }).then(function (canvas: HTMLCanvasElement) {
      //   let img = canvas.toDataURL('image/png')
      //   document.write('<img src="' + img + '" />')
      // })
    }, time)
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
    this.progressBarElm.classList.remove('expand')
  }

  private stop() {
    this.progressBarElm.classList.remove('expand')
    this.selectorElm.classList.add('wb-hidden')
    this.wbSession.wbState = 'pending'
    this.eventCollector.clearEvent()
  }
}