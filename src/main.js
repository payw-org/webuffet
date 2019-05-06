import WEBuffet from './WEBuffet'

let timeout = 0
let wb = undefined

require('./lib/jQueryUI')

let wait = function (e) {
  timeout = window.setTimeout(() => {
    // create WEBuffet instance after mouse hold
    // for better performance
    wb = new WEBuffet()
    window.removeEventListener('mousedown', wait)
    window.removeEventListener('mousemove', clear)
    window.removeEventListener('mouseup', clear)
  }, 0)
}

let clear = function (e) {
  clearTimeout(timeout)
}

window.addEventListener('mousedown', wait)
window.addEventListener('mousemove', clear)
window.addEventListener('mouseup', clear)
