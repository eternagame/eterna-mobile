<template>
<div id="app">
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div class="update-text" v-else-if="needsUpdate">
        Please update the Eterna app or visit <a href="https://eternagame.org">https://eternagame.org</a> to continue playing.
    </div>
    <div v-else>
        <router-view />
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Action } from './store'
export default Vue.extend({
    data() {
        return {
            isLoading: true,
            needsUpdate: false
        }
    },
    mounted() {
        this.$store.dispatch(Action.AUTHENTICATE);
        this.checkVersion();
    },
    methods: {
        async checkVersion() {
            const { data } = (await this.$http.get('/get/?type=mobile_version')).data;
            // If we want to force mobile users to update their app, increment this number and the
            // respective value in the backend
            if (data.latest_build > 1) this.needsUpdate = true;
            this.isLoading = false;
        }
    }
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
    user-select: none;
    background-image: radial-gradient(circle, rgb(4, 51, 95) 0%, rgb(3, 37, 70) 90%);
    height: 100vh;
    width: 100vw;
    margin: 0;
    /* Padding to avoid the "unsafe" areas behind notches in the screen */
    padding: env(safe-area-inset-top, 0) env(safe-area-inset-right, 0) env(safe-area-inset-bottom, 0) env(safe-area-inset-right, 0);
}

.close-button {
    background: url('assets/close-button.png') no-repeat center;
    width: 13px;
    height: 13px;
}

.update-text {
    height: 45vmin;
    margin: 10vmin 5vmin;
    text-align: center;
    font-size: 10vh;
}
</style>
