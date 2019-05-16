import WEBuffet from './WEBuffet'

let timeout = 0
let wb: WEBuffet|undefined = undefined

require('./lib/jquery-ui.min.js')

let wait = function () {
  timeout = window.setTimeout(() => {
    // create WEBuffet instance after mouse hold
    // for better performance
    if (!wb) {
      wb = new WEBuffet()
    }

    wb.start()
    
    // remove event for other operation because it remain until delete
    window.removeEventListener('mousedown', wait)
    window.removeEventListener('mousemove', clear)
    window.removeEventListener('mouseup', clear)
  }, 0)
}

let clear = function () {
  clearTimeout(timeout)
}

window.addEventListener('mousedown', wait)
window.addEventListener('mousemove', clear)
window.addEventListener('mouseup', clear)

document.addEventListener('consolestop', e => {
  window.addEventListener('mousedown', wait)
  window.addEventListener('mousemove', clear)
  window.addEventListener('mouseup', clear)
})

