<template>
  <div id="wbc-console" :class="{hidden: isHidden}">
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
  background-color: rgba(0,0,0,0.9);
  z-index: 2147483646;
  overflow-x: hidden;
  overflow-y: auto;
  transition: opacity 300ms ease;
  opacity: 1;
  pointer-events: all;
  will-change: opacity;

  h1, h2, h3, h4, h5, h6, p {
    padding: 0;
    margin: 0;
    font-family: inherit;
    line-height: 1;
  }

  &.hidden {
    opacity: 0;
    pointer-events: none;
  }

  .hello {
    margin-left: 50px;
    padding-top: 50px;

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
      color: #5cf5cd;
    }
  }
}
</style>
