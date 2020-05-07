<template>
    <div class="puzzle-view-container">
        <router-link to="login" v-if="!loggedIn">Login</router-link>
        <b-row id="puzzle-view-header">
            <b-col>
                <b-img src="https://eternagame.org/home/img/logo_eterna.svg" />
            </b-col>
            <b-col style="align-items:center">
                <b style="font-size:small">Complete these puzzles to unlock lab access!</b>
            </b-col>
            <b-col>
            </b-col>
        </b-row>
        <b-container id="puzzle-scroll" v-on:scroll="onScroll">
            <PuzzleCard
                v-for="(puzzleImage, index) in puzzles"
                :key="index"
                :highlight="index === unlockedPuzzleIndex"
                :source="puzzleImage"
                :state="index < unlockedPuzzleIndex ? 'completed' : index > unlockedPuzzleIndex ? 'locked' : 'unlocked'" />
        </b-container>
        <ProgressBar :value="unlockedPuzzleIndex" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressBar from '../components/ProgressBar.vue'
import PuzzleCard from '../components/PuzzleCard.vue'

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
                'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png',
            ],
            focusedPuzzleIndex: -1,
            unlockedPuzzleIndex: 2,
        }
    },
    mounted() {
        this.updatePuzzleIndex();
    },
    components: {
        ProgressBar,
        PuzzleCard,
    },
    computed: {
        loggedIn(): boolean {
            return this.$store.state.loggedIn;
        },
    },
    methods: {
        clamp(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
        },
        onScroll() {
            this.updatePuzzleIndex();
        },
        updatePuzzleIndex() {
            const scroll = document.getElementById('puzzle-scroll');

            if (scroll === null)
                return;

            const fraction = this.clamp(scroll.scrollLeft / (scroll.scrollWidth - 500), 0, this.puzzles.length);

            const oldIndex = this.$data.focusedPuzzleIndex;
            const newIndex = Math.floor(fraction * this.puzzles.length);

            // update
            if (oldIndex !== newIndex)
            {
                this.$data.focusedPuzzleIndex = newIndex;

                // var cards = document.getElementsByClassName('puzzle-card-container') as HTMLCollectionOf<HTMLElement>;
                // for (var i = 0; i < cards.length; i++) {
                //     if (i === oldIndex) {
                //         cards[i].style.transform = "scale(1)";
                //     }
                //     else if (i === newIndex) {
                //         cards[i].style.transform = "scale(1.1)";
                //     }
                // }
            }
        },
        play() {
            console.log(this.$data.unlockedPuzzleIndex);
        }
    }
});
</script>

<style lang="scss" scoped>
.puzzle-view-container {
    padding: 0;
    margin: 0;
    text-align: center;
}

#puzzle-view-header {
    height: 30vh;
    padding: 4vmin;
}

#puzzle-scroll {
    white-space: nowrap;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    padding-right: 50%;
    padding-left: 50%;
    margin-top: 0vmin;
    margin-bottom: 8vmin;
}

#puzzle-scroll::-webkit-scrollbar {
    display: none;
}

.puzzle-card-container {
    transition: transform 0.2s;
}
</style>
