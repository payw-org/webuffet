import html2canvas from 'html2canvas'
import Chance from 'chance'
import $ from 'jquery'

export default class Thanos {
  constructor() {}

  static snapFingers(elm) {
    this.imageDataArray = []
    this.canvasCount = 35
    this.chance = new Chance()

    html2canvas(elm, {
      useCORS: true,
      backgroundColor: null
    }).then(canvas => {
      //capture all div data as image
      var ctx = canvas.getContext("2d");
      var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      var pixelArr = imageData.data;
      this.createBlankImageData(imageData);
      //put pixel info to imageDataArray (Weighted Distributed)
      for (let i = 0; i < pixelArr.length; i+=4) {
        //find the highest probability canvas the pixel should be in
        let p = Math.floor((i/pixelArr.length) *this.canvasCount);
        let a = this.imageDataArray[this.weightedRandomDistrib(p)];
        a[i] = pixelArr[i];
        a[i+1] = pixelArr[i+1];
        a[i+2] = pixelArr[i+2];
        a[i+3] = pixelArr[i+3];
      }
      // create placeholder
      let placeholder = document.createElement('div')
      placeholder.classList.add('thanos-area')
      placeholder.style.position = 'fixed'
      placeholder.style.zIndex = '2147483645'
      placeholder.style.top = elm.getBoundingClientRect().top + 'px'
      placeholder.style.left = elm.getBoundingClientRect().left + 'px'
      placeholder.style.width = elm.getBoundingClientRect().width + 'px'
      placeholder.style.height = elm.getBoundingClientRect().height + 'px'

      //create canvas for each imageData and append to target element
      for (let i = 0; i < this.canvasCount; i++) {
        let c = this.newCanvasFromImageData(this.imageDataArray[i], canvas.width, canvas.height);
        c.classList.add("wb-thanos-dust");
        // $("body").append(c);
        placeholder.appendChild(c)
      }

      document.body.appendChild(placeholder)

      //clear all children except the canvas
      // $(".content").children().not(".dust").fadeOut(3500);
      $(elm).fadeOut(3500)
      let dusts = document.querySelectorAll('.wb-thanos-dust')
      for (let i = 0; i < dusts.length; i++) {
        this.animateBlur($(dusts[i]),0.8,800)
        setTimeout(() => {
          this.animateTransform($(dusts[i]),100,-100,this.chance.integer({ min: -15, max: 15 }),800+(110*i))
        }, 70*i)
        $(dusts[i]).delay(70*i).fadeOut((110*i)+800,"easeInQuint",()=> {$(dusts[i]).remove();});
      }
      setTimeout(() => {
        document.body.removeChild(document.getElementsByClassName('thanos-area').item(0))
      }, 70*dusts.length*3)
    });
  }

  static weightedRandomDistrib(peak) {
    var prob = [], seq = [];
    for(let i=0;i<this.canvasCount;i++) {
      prob.push(Math.pow(this.canvasCount-Math.abs(peak-i),3));
      seq.push(i);
    }
    return this.chance.weighted(seq, prob);
  }
  static animateBlur(elem,radius,duration) {
    var r =0;
    $({rad:0}).animate({rad:radius}, {
        duration: duration,
        easing: "easeOutQuad",
        step: function(now) {
          elem.css({
                filter: 'blur(' + now + 'px)'
            });
        }
    });
  }
  static animateTransform(elem,sx,sy,angle,duration) {
    let td = 0, tx = 0, ty =0;
    $({x: 0, y:0, deg:0}).animate({x: sx, y:sy, deg:angle}, {
        duration: duration,
        easing: "easeInQuad",
        step: function(now, fx) {
          if (fx.prop == "x")
            tx = now;
          else if (fx.prop == "y")
            ty = now;
          else if (fx.prop == "deg")
            td = now;
          elem.css({
                transform: 'rotate(' + td + 'deg)' + 'translate(' + tx + 'px,'+ ty +'px)'
            });
        }
    });
  }
  static createBlankImageData(imageData) {
    for(let i=0;i<this.canvasCount;i++)
    {
      let arr = new Uint8ClampedArray(imageData.data);
      for (let j = 0; j < arr.length; j++) {
          arr[j] = 0;
      }
      this.imageDataArray.push(arr);
    }
  }
  static newCanvasFromImageData(imageDataArray ,w , h) {
    var canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
    let tempCtx = canvas.getContext("2d");
    tempCtx.putImageData(new ImageData(imageDataArray, w , h), 0, 0);
        
    return canvas;
  }
}