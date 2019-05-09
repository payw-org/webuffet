export default class Ruler {
  constructor() {
  }

  static getDistance(x1: number, y1: number, x2: number, y2: number) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  static getTranslateXY(elm: HTMLElement) {
    let style = window.getComputedStyle(elm)
    let matrix = new WebKitCSSMatrix(style.webkitTransform)
    
    return {
      x: matrix.m41,
      y: matrix.m42
    }
  }

  static getScaleXY(elm: HTMLElement) {
    let matrixRegex = /matrix\(\s*(-?\d*\.?\d*),\s*(-?\d*\.?\d*),\s*(-?\d*\.?\d*),\s*(-?\d*\.?\d*),\s*(-?\d*\.?\d*),\s*(-?\d*\.?\d*)\)/
    let matches = window.getComputedStyle(elm).getPropertyValue('-webkit-transform').match(matrixRegex)
    let x = 1, y = 1
    if (matches && matches[1]) {
      x = Number(matches[1])
    }
    if (matches && matches[2]) {
      y = Number(matches[2])
    }
    return {
      x: x,
      y: y 
    }
  }

  static getRotationValue(elm: HTMLElement) {
    let st = window.getComputedStyle(elm), angle
    let matrix = st.getPropertyValue("-webkit-transform") ||
    st.getPropertyValue("-moz-transform")    ||
    st.getPropertyValue("-ms-transform")     ||
    st.getPropertyValue("-o-transform")      ||
    st.getPropertyValue("transform")
    if(matrix !== 'none') {
      let values = matrix.split('(')[1].split(')')[0].split(',')
      let a = Number(values[0])
      let b = Number(values[1])
      angle = Math.round(Math.atan2(b, a) * (180/Math.PI))
    } else {
      angle = 0;
    }
    return (angle < 0) ? angle +=360 : angle
  }
}