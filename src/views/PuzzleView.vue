<template>
    <div class="puzzle-view-container">
        <b-row id="puzzle-view-header">
            <b-col>
                <b-img src="https://eternagame.org/home/img/logo_eterna.svg" />
            </b-col>
            <b-col>
                <b style="font-size:4vmin;line-height:5.0vmin;">Complete these puzzles to unlock lab access!</b>
            </b-col>
            <b-col>
                <b-row v-if="loggedIn" style="justify-content:flex-end">
                    <b style="font-size:3.5vmin;line-height:6vmin;margin-right:2vmin;">{{ playerName }} </b>
                    <div class="puzzle-view-icon-people" />
                </b-row>
                <b-row v-else style="justify-content:flex-end">
                    <b-button class="puzzle-view-button" variant="primary" style="margin-right:3vmin" to="login">Log in</b-button>
                    <b-button class="puzzle-view-button" variant="secondary" to="register">Register</b-button>
                </b-row>
            </b-col>
        </b-row>
        <b-container id="puzzle-scroll" v-on:scroll="onScroll">
            <PuzzleCard
                v-for="(puzzle, index) in puzzles"
                :key="index"
                :highlight="index === playablePuzzleIndex"
                :imgSrc="puzzle.imgSrc"
                v-on:play="play(puzzle.id)"
                :state="index < playablePuzzleIndex ? 'completed' : index > playablePuzzleIndex ? 'locked' : 'unlocked'" />
        </b-container>
        <b-row id="puzzle-view-footer">
            <b-col></b-col>
            <b-col class="col-8">
                <ProgressBar :value="playablePuzzleIndex" />
            </b-col>
            <b-col>
                <b-row style="justify-content:flex-end;align-items:flex-end;">
                    <button v-on:click="openChat" class="puzzle-view-chat-button" />
                </b-row>
            </b-col>
        </b-row>
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
                { id: 0, imgSrc: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png' },
                { id: 0, imgSrc: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/6A70A1E1-9A81-4BA0-B765-A12B8F821300.png' },
                { id: 0, imgSrc: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/E280848F-6347-4CC5-A215-F08B1F55ED1B.png' },
                { id: 0, imgSrc: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png' },
                { id: 0, imgSrc: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/6A70A1E1-9A81-4BA0-B765-A12B8F821300.png' },
                { id: 0, imgSrc: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/E280848F-6347-4CC5-A215-F08B1F55ED1B.png' },
                { id: 0, imgSrc: 'https://cdn.zeplin.io/5e88563a3843011f95808b2f/assets/5ED5D090-6F62-4DF8-8C54-CC71306A4B16.png' },
            ],
            focusedPuzzleIndex: -1,
            playablePuzzleIndex: 1,
            playerName: 'PlayerOne',
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
        play(id: number) {
            this.$router.push(`game/${id}`);
        },
        openChat() {
            console.log('open chat');
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
    padding-top: 3vmin;
    margin-left: 3vmin;
    margin-right: 3vmin;
}

#puzzle-scroll {
    white-space: nowrap;
    overflow-x: scroll;
    scroll-snap-type: x mandatory;
    padding-right: 50%;
    padding-left: 50%;
    margin-top: 0vmin;
    margin-bottom: 6vmin;
}

#puzzle-scroll::-webkit-scrollbar {
    display: none;
}

#puzzle-view-footer {
    margin-left: 3vmin;
    margin-right: 3vmin;
}

.puzzle-card-container {
    transition: transform 0.2s;
}

.puzzle-view-button {
    font-size: 3.5vmin;
}

.puzzle-view-chat-button {
    background: url('../assets/Chat.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 9vmin;
    height: 8vmin;
}

.puzzle-view-icon-people {
    background-image: url('../assets/DefaultIcon.svg');
    background-position: center top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 6vmin;
    display: inline-block;
}
</style>
