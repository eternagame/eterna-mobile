<template>
    <div class="container">
        <h3>Complete these puzzles to unlock lab access!</h3>
        <b-progress :value="1" :max="puzzles.length" variant="secondary"/>
        <b-row id="puzzle-list">
            <b-col v-for="puzzleImage in puzzles" :key="puzzleImage">
                <b-img class="puzzle-item" :src="puzzleImage"/>
            </b-col>
        </b-row>
        <b-button variant="primary">CONTINUE</b-button>
        <b-button v-on:click="prevPuzzle">Prev</b-button>
        <b-button v-on:click="nextPuzzle">Next</b-button>

        <!-- <a class="carousel-control-prev" href="#recipeCarousel" role="button" data-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="sr-only">Previous</span>
        </a>
        <a class="carousel-control-next" href="#recipeCarousel" role="button" data-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="sr-only">Next</span>
        </a> -->
    </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    data() {
        return {
            puzzles: [
                'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png',
                'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/6A70A1E1-9A81-4BA0-B765-A12B8F821300.png',
                'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/E280848F-6347-4CC5-A215-F08B1F55ED1B.png',
                'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png',
                'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/6A70A1E1-9A81-4BA0-B765-A12B8F821300.png',
                'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/E280848F-6347-4CC5-A215-F08B1F55ED1B.png',
            ],
            puzzleIndex: 0,
        }
    },
    methods: {
        nextPuzzle() {
            this.modifyPuzzleList(+1);
        },
        prevPuzzle() {
            this.modifyPuzzleList(-1);
        },
        modifyPuzzleList(f: number) {
            this.puzzleIndex = this.clamp(this.puzzleIndex + f, 0, this.puzzles.length - 1);

            const list = document.getElementById('puzzle-list');
            if (list === null)
                return;

            const interval = 200;
            list.style.marginLeft = (-this.puzzleIndex * interval) + "px";
        },
        clamp(x: number, min: number, max: number) {
            return x < min ? min : x > max ? max : x;
        }
    }
});
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;
}

#puzzle-list {
    flex-wrap: nowrap;
    overflow: hidden;
    margin-left: 0px;
    transition: margin-left 0.5s;
}

.puzzle-item {
    position: relative;
    background: #21508c;
    padding: 0px;
    margin: 10px;
    width: 150px;
    height: 150px;
}
</style>