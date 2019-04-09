import WBStorage from "./WBStorage"

export default class WBSelector {
  private selectorElm: HTMLElement
  private readonly wbStorage: WBStorage
  private mouseMoveTimeout: number
  private progressBarDom: HTMLElement
  public isStarted: boolean = false

  constructor(selectorElm: HTMLElement, wbStorage: WBStorage) {
    this.selectorElm = selectorElm
    this.wbStorage = wbStorage
    this.progressBarDom = this.selectorElm.querySelector('#wbc-progress-bar')

    // Event Listeners
    window.addEventListener('mouseover', e => {
      if (this.isStarted && e.target instanceof HTMLElement) {
        this.setView()
      }
    })

    // When stop moving a pointer,
    // scanning effect starts after an interval.
    window.addEventListener('mousemove', e => {
      if (!this.isStarted) return

      this.progressBarDom.classList.remove('expand')
      clearTimeout(this.mouseMoveTimeout)
      this.mouseMoveTimeout = window.setTimeout(() => {
        this.progressBarDom.classList.add('expand')
      }, 700)
    })
  }

  private setView() {
    let selectedElm = this.wbStorage.getSelectedElement()
    let boundingRect = selectedElm.getBoundingClientRect()
    this.selectorElm.style.left = boundingRect.left + 'px'
    this.selectorElm.style.top = boundingRect.top + 'px'
    this.selectorElm.style.width = boundingRect.width + 'px'
    this.selectorElm.style.height = boundingRect.height + 'px'
  }

  start() {
    this.selectorElm.classList.remove('hidden')
    this.isStarted = true
  }

  end() {
    this.selectorElm.classList.add('hidden')
    this.isStarted = false
  }

  whenScanningCompleted(switchMode: Function) {
    this.progressBarDom.addEventListener('transitionend', () => {
      switchMode()
    })
  }
}