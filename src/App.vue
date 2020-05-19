<template>
<div id="app">
    <router-view />
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Action } from './store'
export default Vue.extend({
    mounted() {
        this.$store.dispatch(Action.AUTHENTICATE);
    },
});
</script>

<style lang="scss">
@import 'src/styles/global.scss';

@import '~bootstrap/scss/bootstrap.scss';
@import '~bootstrap-vue/src/index.scss';

@import 'src/styles/_bootswatch.scss';
@import 'src/styles/custom.scss';

* {
    -webkit-tap-highlight-color: rgba(0,0,0,0); /* make transparent link selection, adjust last value opacity 0 to 1.0 */
}

*:focus {
    outline: none;
}

body {
    -webkit-touch-callout: none;                /* prevent callout to copy image, etc when tap to hold */
    -webkit-text-size-adjust: none;             /* prevent webkit from resizing text to fit */
    -webkit-user-select: none;                  /* prevent copy paste, to allow, change 'none' to 'text' */
    background-image: radial-gradient(circle, rgb(4, 51, 95) 0%, rgb(3, 37, 70) 90%);
    height: 100vh;
    width: 100vw;
    margin: 0;
    /* Padding to avoid the "unsafe" areas behind notches in the screen */
    padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-right, 0);
}

h1 {
    font-size: 24px;
    font-weight: normal;
    margin: 0;
    overflow: visible;
    padding: 0;
    text-align: center;
}
</style>
