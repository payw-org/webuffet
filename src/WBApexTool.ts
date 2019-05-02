import WBStorage from "./WBStorage"

// Todo
// Preserve delete, resize, more buttons rotation

export default class WBApexTool {
  private apexToolElm: HTMLElement
  private removeBtn: HTMLElement
  private rotateBtn: HTMLElement
  private scaleBtn: HTMLElement
  private moreBtn: HTMLElement
  private readonly wbStorage: WBStorage

  constructor(apexToolElm: HTMLElement, wbStorage: WBStorage) {
    this.apexToolElm = apexToolElm
    this.wbStorage = wbStorage

    // Store each button of apex tool
    this.removeBtn = this.apexToolElm.querySelector('.remove')
    this.rotateBtn = this.apexToolElm.querySelector('.rotate')
    this.scaleBtn = this.apexToolElm.querySelector('.scale')
    this.moreBtn = this.apexToolElm.querySelector('.more')

    // Add event listeners
    this.removeBtn.addEventListener('click', e => {
      // Remove selected elm
    })

    this.rotateBtn.addEventListener('mousedown', e => {

    })
    window.addEventListener('mousemove', e => {

    })

    this.scaleBtn.addEventListener('mousedown', e => {

    })
    window.addEventListener('mousemove', e => {

    })

    this.moreBtn.addEventListener('click', e => {
      
    })
  }

  private setBoundingRectPos() {
    const originalState = this.wbStorage.getOriginalState()
    const finalState = this.wbStorage.getFinalState()

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
    this.moreBtn.style.transform = 'rotate(' + -(finalState.rotate) + 'deg)'
    this.moreBtn.style.webkitTransform = 'rotate(' + -(finalState.rotate) + 'deg)'
  }
}