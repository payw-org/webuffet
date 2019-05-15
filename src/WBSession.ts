import Ruler from "./Ruler"

//Save infromation for return to its original form
interface OriginalState {
  coordinate: {
    x: number,
    y: number
  }
}

interface FinalState {
  scale?: number
  rotate?: number,
  translate?: {
    x: number,
    y: number
  },
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
  private StateStack : FinalState[] = []
  private RedoStack : FinalState[] = []
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
      scale: Ruler.getScaleXY(elm).x,
      rotate: Ruler.getRotationValue(elm),
      translate: Ruler.getTranslateXY(elm),
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
    if ('translate' in state) {
      this.finalState.translate = state.translate
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

  pop() : void {  // undo
    this.RedoStack.push(JSON.parse(JSON.stringify(this.StateStack.pop())))
    this.finalState = JSON.parse(JSON.stringify(this.StateStack[this.StateStack.length - 1]))
  }

  push() : void {  // push state into stack
    let temp = JSON.parse(JSON.stringify(this.finalState))
    this.StateStack.push(temp)
  }

  redo() : void {  // redo
    this.finalState = JSON.parse(JSON.stringify(this.RedoStack.pop()))
    this.StateStack.push(JSON.parse(JSON.stringify(this.finalState)))
  }

  length() : number {  // stack length check
    return this.StateStack.length
  }

  redoLength() : number {  // stack length check
    return this.RedoStack.length
  }

  clearRedo() : void {  // clear Redo stack when another modification starts
    this.RedoStack = []
  }
}
