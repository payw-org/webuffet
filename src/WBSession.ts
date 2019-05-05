import Ruler from "./Ruler"

interface OriginalState {
  coordinate: {
    x: number,
    y: number
  }
}

interface FinalState {
  scale?: number
  rotate?: number,
  coordinate?: {
    x: number,
    y: number
  }
}

export default class WBSession {
  private currentURL: string
  private selectedElm: HTMLElement
  private originalState: OriginalState
  private finalState: FinalState
  public wbState: 'pending'|'select'|'apex' = 'pending'

  constructor() {
    this.currentURL = window.location.href
  }

  setOriginal(elm: HTMLElement) {
    this.selectedElm = elm
    const rect = elm.getBoundingClientRect()
    this.originalState = {
      coordinate: {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      }
    }

    this.finalState = {
      scale: 1,
      rotate: 0,
      coordinate: {
        x: this.originalState.coordinate.x,
        y: this.originalState.coordinate.y
      }
    }
  }

  setFinal(state: FinalState) {
    if (!this.selectedElm) {
      console.error('No selected element')
      return
    }

    if ('scale' in state) {
      this.finalState.scale = state.scale
    }
    if ('rotate' in state) {
      this.finalState.rotate = state.rotate
    }
    if ('coordinate' in state) {
      this.finalState.coordinate = state.coordinate
    }
  }

  getSelectedElement() {
    return this.selectedElm
  }

  getOriginalState() {
    return this.originalState
  }

  private setFinalState(state: FinalState) {
    this.finalState = state
  }

  getFinalState() {
    return this.finalState
  }
}