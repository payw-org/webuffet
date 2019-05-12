interface EventInfo {
  target: Window|Document|HTMLElement,
  eventName: string,
  reference: any
}

export default class EventCollector {
  private collection: Array<EventInfo> = []

  constructor() {}

  // Add event listener and store the reference
  attachEvent(target: Window|Document|HTMLElement, eventName: string, reference: any) {
    target.addEventListener(eventName, reference)
    this.collection.push({
      target: target,
      eventName: eventName,
      reference: reference
    })
  }

  // Remove all event listeners from each target
  clearEvent() {
    this.collection.forEach(item => {
      item.target.removeEventListener(item.eventName, item.reference)
    })
  }
}