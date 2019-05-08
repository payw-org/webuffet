<template>
  <div id="wbc-console" :class="{hidden: isHidden}">
    <button class="close" @click="close">
      <div class="cross cross-1"></div>
      <div class="cross cross-2"></div>
    </button>
    <div class="hello">
      <h1 class="title"><span class="wb">WEBuffet</span> <span class="hall">Hall</span></h1>
      <p class="current-url">{{ currentURL }}</p>
    </div>
    <div class="tools"></div>
    <div class="current-url-cooked"></div>
    <dir class="other-url-cooked">

    </dir>
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

    },
    close() {
      this.isHidden = true
      let e = new CustomEvent('closeconsole')
      document.dispatchEvent(e)
    }
  },
  mounted() {
    setTimeout(() => {
      this.isHidden = false
    }, 100)
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
  background-color: #222;
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

  &.hidden {
    transform: scale(1.1);
    opacity: 0;
    pointer-events: none;
  }

  .close {
    position: absolute;
    right: 50px;
    top: 50px;
    background-color: #333;
    border: none;
    border-radius: 50px;
    width: 50px;
    height: 50px;

    .cross {
      width: 23px;
      height: 3px;
      position: absolute;
      top: 50%;
      left: 50%;
      background-color: #c3c3c3;
      border-radius: 50px;

      &.cross-1 {
        transform: translateX(-50%) translateY(-50%) rotate(45deg);
      }
      &.cross-2 {
        transform: translateX(-50%) translateY(-50%) rotate(-45deg);
      }
    }
  }

  .hello {
    padding: 0 50px;
    margin-top: 50px;

    .title {
      font-family: inherit;
      font-size: 40px;
      font-weight: 400;
      margin: 0;

      .wb {
        font-weight: 700;
      }
      .hall {
        font-weight: 300;
        color: #cacaca;
      }
    }

    .current-url {
      margin: 0;
      margin-top: 1em;
      font-family: inherit;
      font-size: 17px;
      line-height: 1.2;
      color: #5cf5cd;
    }
  }
}
</style>
