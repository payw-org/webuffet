export default class Ruler {
  constructor() {
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
    let style = window.getComputedStyle(elm)
    let matrix = new WebKitCSSMatrix(style.webkitTransform)
    
    return {
      x: matrix.a,
      y: matrix.d
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