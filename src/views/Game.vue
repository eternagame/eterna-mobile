<template>
<div id="game-container">
    <iframe id="game" title="Game" :src="gameUrl"></iframe>
    <div id="overlay">
        <router-link to="/" exact>Back to Home</router-link>
    </div>
</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    computed: {
        gameUrl() {
            const puzzle = this.$route.params.puzzle;
            if (puzzle) {
                return 'eternajs/index.html?puzzle=' + this.$route.params.puzzle;
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

#overlay {
    position: absolute;
    right: 10px;
    top: 10px;
    background-color: rgba(112, 112, 112, 0.671);
    padding: 2px 8px;
    border-radius: 4px;
}
</style>
