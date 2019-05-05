import Ruler from "./Ruler"

interface OriginalState {
  width: number
  height: number
  left: number
  top: number
  scale: number
  rotate: number
  distanceFromOrigin: number
}

interface FinalState {
  left: number
  top: number
  scale: number
  rotate: number
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
      width: rect.width,
      height: rect.height,
      left: rect.left,
      top: rect.top,
      scale: Ruler.getScaleXY(elm).x,
      rotate: Ruler.getRotationValue(elm),
      distanceFromOrigin: Math.sqrt(Math.pow(rect.width, 2) + Math.pow(rect.height, 2)) / 2
    }

    this.setFinal()
  }

  setFinal() {
    if (!this.selectedElm) {
      console.error('No selected element')
      return
    }

    const rect = this.selectedElm.getBoundingClientRect()

    this.finalState = {
      left: rect.left,
      top: rect.top,
      scale: Ruler.getScaleXY(this.selectedElm).x,
      rotate: Ruler.getRotationValue(this.selectedElm)
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