<template>
  <div id="wbc-console" :class="{'wb-console-hidden': isHidden}">
    <button class="wb-close" @click="stop">
      <div class="wb-cross cross-1"></div>
      <div class="wb-cross cross-2"></div>
    </button>
    <div class="wb-hello">
      <h1 class="wb-title"><span class="wb">WEBuffet</span> <span class="wb-hall">Hall</span></h1>
      <p class="wb-current-url">{{ currentURL }}</p>
    </div>
    <div class="wb-current-url-cooked">
      <div class="wb-item new" @click="startScanning">
        <div class="wb-cross cross-1"></div>
        <div class="wb-cross cross-2"></div>
      </div>
    </div>
    <dir class="wb-other-url-cooked"></dir>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isHidden: true
    }
  },
  computed: {
    currentURL() {
      return window.location.href
    }
  },
  methods: {
    start() {
      this.show()
    },
    stop() {
      this.hide()
      document.dispatchEvent(new CustomEvent('consolestop'))
    },
    show() {
      this.$el.getBoundingClientRect().height
      this.isHidden = false
    },
    hide() {
      this.isHidden = true
    },
    startScanning() {
      this.hide()
      document.dispatchEvent(new CustomEvent('startselector'))
    }
  },
  mounted() {
    document.addEventListener('loadconsole', () => {
      this.start()
    })
  }
}
</script>


<style lang="scss">
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
    background-color: #cfcfcf;
    border-radius: 50px;
  
    &.cross-1 {
      transform: translateX(-50%) translateY(-50%) rotate(45deg);
    }
    &.cross-2 {
      transform: translateX(-50%) translateY(-50%) rotate(-45deg);
    }
  }

  .wb-close {
    position: absolute;
    right: 50px;
    top: 50px;
    background-color: #000;
    border: none;
    border-radius: 50px;
    width: 50px;
    height: 50px;

    &, & * {
      cursor: pointer !important;
    }
  }

  .wb-hello {
    padding: 0 50px;
    margin-top: 50px;

    .wb-title {
      text-align: left;
      font-family: inherit;
      font-size: 40px;
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
      font-size: 17px;
      line-height: 1.2;
      color: #5cf5cd;
    }
  }

  .wb-current-url-cooked {
    margin-top: 50px;

    .wb-item {
      width: 200px;
      height: 150px;
      margin: 0 50px;
      position: relative;
      box-shadow: 0 10px 50px rgba(0,0,0,0.5);
      transition: transform 0.2s ease;
      will-change: transform;

      &:hover {
        transform: scale(1.05);
      }

      &:active {
        transform: scale(0.95);
      }

      &.new {
        background-image: linear-gradient(to bottom, #888, #444);
        border-radius: 8px;
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
    }
  }
}
</style>
