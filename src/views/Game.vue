<template>
<div id="game-container">
    <iframe id="game" title="Game" :src="gameUrl"></iframe>
</div>
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
            const puzzle = this.$route.params.puzzle;
            if (puzzle) {
                return 'eternajs/index.html?puzzle=' + puzzle;
            } else {
                return 'eternajs/index.html';
            }
        },
    },
})
</script>

<style lang="scss" scoped>
#game {
    width: 100vw;
    height: 100vh;
    border: 0;
}
</style>
