import Vue from 'vue'
import Console from 'Components/console.vue'
import WBSession from './WBSession'
import WBSelector from './WBSelector'
import WBApexTool from './WBApexTool'

export default class WEBuffet {
  private readonly wbSession: WBSession
  private readonly wbSelector: WBSelector
  private readonly wbApexTool: WBApexTool
  private readonly wbComponents: HTMLElement

  constructor() {
    require('./scss/webuffet.scss')

    // Inject WEBuffet components into document
    let componentHTML = require('./templates/webuffet.html')
    this.wbComponents = new DOMParser().parseFromString(componentHTML, 'text/html').querySelector('#webuffet-components')
    document.body.insertBefore(this.wbComponents, document.body.firstChild)

    // Add Console Component
    new Vue({
      el: "#wbc-console",
      template: '<Console/>',
      components: { Console }
    })

    this.wbSession = new WBSession()
    this.wbSelector = new WBSelector(this.wbComponents.querySelector('#wbc-selector'), this.wbSession)
    this.wbApexTool = new WBApexTool(this.wbComponents.querySelector('#wbc-editing-boundary'), this.wbSession)

    document.addEventListener('consolestop', this.stop)
  }

  start() {
    document.body.classList.add('webuffet-activated')
    document.dispatchEvent(new CustomEvent('loadconsole'))
  }

  stop() {
    document.body.classList.remove('webuffet-activated')
  }
}