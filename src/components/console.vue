<template>
  <div id="wbc-console" :class="{'wb-console-hidden': isHidden}">
    <button class="wb-close" @click="stop">
      <div class="wb-cross cross-1"></div>
      <div class="wb-cross cross-2"></div>
    </button>
    <div class="centered">
      <div class="wb-hello">
        <h1 class="wb-title"><span class="wb">WEBuffet</span> <span class="wb-hall">Hall</span></h1>
        <p class="wb-current-url">{{ currentURL }}</p>
        <h2 class="this-page">Cooked On This Page</h2>
      </div>
    </div>
    <div class="wb-current-url-cooked scroll">
      <div class="wb-item new" @click="startScanning">
        <div class="wb-cross cross-1"></div>
        <div class="wb-cross cross-2"></div>
      </div>
      <div class="wb-item" v-for="(item, i) in modifiedItems" :key="i">
        <!-- <p>id: {{ item.name.id }}</p>
        <p>tName: {{ item.name.tName }}</p>
        <p>tIndex: {{ item.name.tIndex }}</p>
        <p>isDeleted: {{ item.style.isDeleted }}</p>
        <p>translatex: {{ item.style.translatex }}</p>
        <p>translatey: {{ item.style.translatey }}</p>
        <p>rotate: {{ item.style.rotate }}</p>
        <p>scale: {{ item.style.scale }}</p> -->
        <img class="preview" :src="item.imgSrc" alt="">
      </div>
    </div>
    <div class="centered">
      <button style="margin-top: 100px;" @click="allowThanos">Thanos</button>
    </div>
    <!-- <h2 class="wb-setting-letter">Setting Time</h2>
    <div class="wb-for-up" @click="increaseTime">
     <div class="wb-arrow up"></div>
    </div>
    <div class="wb-for-down" @click="decreaseTime">
       <div class="wb-arrow down"></div>
    </div> -->
    <!-- <div class="centered">
      <h2 class="other-pages-title">Cooked On Other Pages</h2>
    </div>
    <div class="wb-other-url-cooked">
    </div> -->
  </div>
</template>

<script>
import html2canvas from 'html2canvas'

export default {
  data() {
    return {
      isHidden: true,
      modifiedItems: [],
      captureData: []
    }
  },
  computed: {
    currentURL() {
      return window.location.href
    }
  },
  methods: {
    allowThanos() {
      document.dispatchEvent(new CustomEvent('allowthanos'))
    },
    start() {
      this.$el.getBoundingClientRect().width
      setTimeout(() => {
        this.$nextTick(() => {
          this.show()
        })
      }, 100)
    },
    stop() {
      this.hide()
      document.dispatchEvent(new CustomEvent('consolestop'))
    },
    show() {
      // html2canvas(document.body, {
      //   allowTaint: true,
      //   useCORS: true
      // }).then(canvas => {
      //   canvas.id = 'wbc-blurry-background'
      //   canvas.style.position = 'absolute'
      //   canvas.style.zIndex = '999999999'
      //   canvas.style.filter = 'blur(20px) saturate(1.2)'
      //   document.body.insertBefore(canvas, document.body.firstChild)

      //   this.$el.getBoundingClientRect().height
      //   this.isHidden = false
      // })

      this.isHidden = false

      //Load data and display on the console
      this.printCooked()
    },
    hide() {
      this.isHidden = true
      // let bg = document.querySelector('#wbc-blurry-background')
      // bg.parentElement.removeChild(bg)
    },
    startScanning() {
      this.hide()
      document.dispatchEvent(new CustomEvent('startselector'))
    },
    increaseTime(){
      document.dispatchEvent(new CustomEvent('increasetime'))
    },
    decreaseTime(){
      document.dispatchEvent(new CustomEvent('decreasetime'))
    },
    printCooked() {
      //Load data and display on the console
      let captures = JSON.parse(document.querySelector('#webuffet-image-sources').getAttribute('data'))
      this.captureData = captures
      let temp = []
      this.modifiedItems = []
      chrome.storage.sync.get(['myCustom'], items => {
        for (let i = 0, j = 0; i < items.myCustom.length; i++) {
          if(items.myCustom[i].url === document.URL) {
            temp[j] = items.myCustom[i]
            temp[j].imgSrc = this.captureData[i]
            j++
          }
        }
        for (let i = 0; i < temp.length; i++) {
          this.modifiedItems.push(temp[i])
        }
        console.log(this.captureData)
      })
    }
  },
  created() {
    // let captures = JSON.parse(document.querySelector('#webuffet-image-sources').getAttribute('data'))
    // this.captureData = captures
  },
  mounted() {
    document.addEventListener('loadconsole', () => {
      this.start()
    })
  }
}
</script>


<style lang="scss" scoped>
#wbc-console {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: fixed;
  color: #fff;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background-color: rgba(#111, 0.9);
  z-index: 2147483646;
  overflow-x: hidden;
  overflow-y: auto;
  transition: opacity 400ms ease, transform 400ms ease;
  opacity: 1;
  pointer-events: all;
  will-change: opacity, transform;
  word-wrap: break-word;
  word-break: break-all;

  ::-webkit-scrollbar {
    width: 0px;  /* Remove scrollbar space */
    height: 0px;
    background: transparent;  /* Optional: just make scrollbar invisible */
  }
  /* Optional: show position indicator in red */
  ::-webkit-scrollbar-thumb {
      background: transparent;
  }

  .centered {
    max-width: 1200px;
    margin: auto;
    padding-left: 50px;
    padding-right: 50px;
  }

  .scroll {
    padding-left: calc(50% - 650px);
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  }

  h2 {
    font-size: 25px;
    font-weight: 400;
  }

  &, & * {
    outline: none;
  }

  button {
    cursor: pointer;
  }

  h1, h2, h3, h4, h5, h6, p {
    padding: 0;
    margin: 0;
    font-family: inherit;
    line-height: 1;
  }

  &.wb-console-hidden {
    transform: scale(1.05);
    opacity: 0;
    pointer-events: none;
  }

  .wb-cross {
    width: 23px;
    height: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    background-color: #757575;
    border-radius: 50px;
  
    &.cross-1 {
      transform: translateX(-50%) translateY(-50%) rotate(45deg);
    }
    &.cross-2 {
      transform: translateX(-50%) translateY(-50%) rotate(-45deg);
    }
  }

  .wb-for-up {
    position: absolute;
    top: 50px;
    right : 185px;
    background-color:#fff;
    border: none;
    border-radius: 50px;
    width: 50px;
    height: 50px;
    &:hover {
        transform: scale(1.05);
      }

    &:active {
        transform: scale(0.95);
     }
    &, & * {
         cursor: pointer !important;
      }
  
  }
  .wb-for-down {
    position: absolute;
    top: 50px;
    right : 130px;
    background-color:#fff;
    border: none;
    border-radius: 50px;
    width: 50px;
    height: 50px;
    &:hover {
        transform: scale(1.05);
      }

    &:active {
        transform: scale(0.95);
    }
    &, & * {
          cursor: pointer !important;
      }
  
  }

  .wb-arrow{
    position : absoulte;
    border: solid black;
    border-width: 0 6px 6px 0;
    display: inline-block;
    padding: 6px;
    
    &.up {
      transform: translateX(90%) translateY(105%) rotate(-135deg);
    }
    &.down {
      transform: translateX(90%) translateY(75%) rotate(45deg);
    }
  }

  .wb-setting-letter{
    position : absolute;
    right : 245px;
    top : 60px;
    font-size: 25px;
    font-weight: 400;
  }

  .wb-close {
    position: absolute;
    right: 50px;
    top: 50px;
    background-color: #fff;
    border: none;
    border-radius: 50px;
    width: 50px;
    height: 50px;

    &, & * {
      cursor: pointer !important;
    }
  }

  .wb-hello {
    margin-top: 50px;

    .wb-title {
      text-align: left;
      font-family: inherit;
      font-size: 50px;
      font-weight: 400;
      margin: 0;

      .wb {
        font-weight: 700;
      }
      .wb-hall {
        font-weight: 300;
        color: #cacaca;
      }
    }

    .wb-current-url {
      margin: 0;
      margin-top: 1em;
      font-family: inherit;
      font-size: 20px;
      line-height: 1.2;
      color: #5cf5cd;
    }

    .this-page {
      font-size: 25px;
      font-weight: 400;
      margin-top: 70px;
    }
  }

  .wb-current-url-cooked {
    margin-top: 30px;
    white-space: nowrap;
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 0;

    .wb-item {
      box-sizing: border-box;
      display: inline-block;
      vertical-align: top;
      background-color: #fff;
      word-break: break-all;
      color: #000;
      width: 300px;
      margin-right: 25px;
      position: relative;
      box-shadow: 0 5px 15px rgba(0,0,0,0.2);
      transition: transform 0.2s ease;
      will-change: transform;
      border-radius: 10px;
      padding: 20px;
      font-size: 20px;

      &:first-child {
        margin-left: 50px;
      }

      &:last-child {
        margin-right: 50px;
      }

      &:hover {
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      &.new {
        background-color: #fff;
        height: 200px;

        &, & * {
          cursor: pointer !important;
        }

        .wb-cross {
          width: 55px;
          height: 8px;

          &.cross-1 {
            transform: translateX(-50%) translateY(-50%) rotate(90deg);
          }
          &.cross-2 {
            transform: translateX(-50%) translateY(-50%);
          }
        }
      }

      .preview {
        width: 100%;
      }
    }
  }

  .other-pages-title {
    margin-top: 70px;
  }

  .wb-other-url-cooked {
  }
}
</style>
