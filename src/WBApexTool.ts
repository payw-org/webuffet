import WBSession from "./WBSession"

// Todo
// Preserve delete, resize, more buttons rotation

export default class WBApexTool {
  private apexToolElm: HTMLElement
  private removeBtn: HTMLElement
  private rotateBtn: HTMLElement
  private scaleBtn: HTMLElement
  private moreBtn: HTMLElement
  private readonly wbSession: WBSession

  private mode: undefined|'remove'|'rotate'|'scale' = undefined

  constructor(apexToolElm: HTMLElement, wbSession: WBSession) {
    this.apexToolElm = apexToolElm
    this.wbSession = wbSession

    // Store each button of apex tool
    this.removeBtn = this.apexToolElm.querySelector('.remove')
    this.rotateBtn = this.apexToolElm.querySelector('.rotate')
    this.scaleBtn = this.apexToolElm.querySelector('.scale')
    this.moreBtn = this.apexToolElm.querySelector('.more')

    // Add event listeners
    window.addEventListener('mousedown', e => {
      if (e.target instanceof HTMLElement) {
        if (e.target.closest('#wbc-editing-boundary .remove')) {
          console.log('remove btn')
        } else if (e.target.closest('#wbc-editing-boundary .rotate')) {
          console.log('rotate btn')
        } else if (e.target.closest('#wbc-editing-boundary .scale')) {
          console.log('scale btn')
        } else if (e.target.closest('#wbc-editing-boundary')) {
          console.log('move')
        }
      }
    })

    window.addEventListener('mouseup', e => {
      this.mode = undefined
    })
  }

  public start() {
    this.apexToolElm.classList.remove('hidden')
    this.setBoundingRectPos()
    this.wbSession.wbState = 'apex'
  }

  public stop() {
    this.apexToolElm.classList.add('hidden')
    this.wbSession.wbState = 'pending'
  }

  private setBoundingRectPos() {
    const originalState = this.wbSession.getOriginalState()
    const finalState = this.wbSession.getFinalState()

    let scaledWidth = originalState.width * originalState.scale
    let scaledHeight = originalState.height * originalState.scale
    let deltaX = scaledWidth - originalState.width
    let deltaY = scaledHeight - originalState.height

    // Set ApexTool's boundary position
    this.apexToolElm.style.left = originalState.left - deltaX/2 + 'px'
    this.apexToolElm.style.top = originalState.top - deltaY/2 + 'px'
    this.apexToolElm.style.width = originalState.width * finalState.scale + 'px'
    this.apexToolElm.style.height = originalState.height * finalState.scale + 'px'
    this.apexToolElm.style.transform = 'rotate(' + finalState.rotate + 'deg)'
    this.apexToolElm.style.webkitTransform = 'rotate(' + finalState.rotate + 'deg)'

    // Preserve buttons' horizontality
    // by rotating to oposite degrees
    this.removeBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.removeBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.rotateBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.rotateBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.removeBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.removeBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
    // this.moreBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    // this.moreBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
  }
}