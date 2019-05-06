export default interface ScannedEvent extends CustomEvent {
  detail: {
    target: HTMLElement
  },
  bubbles: boolean,
  cancelable: boolean
}