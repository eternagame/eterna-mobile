<template>
<iframe id="game" title="Game" :src="gameUrl"></iframe>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    mounted() {
        const gameFrame = document.getElementById('game');
        if (gameFrame) {
            gameFrame.addEventListener('navigate', e => {
                const location: string = (<CustomEvent>e).detail;
                this.$router.replace(location);
            });
        }
    },
    computed: {
        gameUrl() {
            const puzzle = this.$route.params.id;
            if (puzzle) {
                return `eternajs/index.html?puzzle=${puzzle}&mode=design_browser`;
            } else {
                return 'eternajs/index.html';
            }
        },
    },
})
</script>

<style lang="scss" scoped>
#game {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    border: 0;
}
</style>
