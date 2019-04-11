import Ruler from "./Ruler"

export default class WBStorage {
  private currentURL: string
  private selectedElm: HTMLElement
  private originalState: {
    width: number
    height: number
    left: number
    top: number
    scale: number
    rotate: number
  }
  private finalState: {
    left: number
    top: number
    scale: number
    rotate: number
  }

  constructor() {}

  setOriginal(elm: HTMLElement) {
    this.selectedElm = elm
    this.originalState.left = elm.getBoundingClientRect().left
    this.originalState.top = elm.getBoundingClientRect().top
    this.originalState.scale = Ruler.getScaleXY(elm).x
    this.originalState.rotate = Ruler.getRotationValue(elm)
  }

  setFinal() {
    if (!this.selectedElm) {
      console.error('No selected element')
      return
    }

    this.finalState.left = this.selectedElm.getBoundingClientRect().left
    this.finalState.top = this.selectedElm.getBoundingClientRect().top
    this.finalState.scale = Ruler.getScaleXY(this.selectedElm).x
    this.finalState.rotate = Ruler.getRotationValue(this.selectedElm)
  }

  getSelectedElement() {
    return this.selectedElm
  }

  getOriginalState() {
    return this.originalState
  }

  getFinalState() {
    return this.finalState
  }
}