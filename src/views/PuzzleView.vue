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
                v-for="(puzzle, index) in roadmap"
                :key="index"
                :highlight="index === playablePuzzleIndex"
                :imgSrc="getAbsUrl(puzzle.image)"
                v-on:play="play(puzzle.current_puzzle)"
                :state="puzzle.to_next >= 1 ? 'completed' : (puzzle.level - 1) > puzzle.current_level ? 'locked' : 'unlocked'"
                v-b-popover.click.blur.top.html="{
                    content: puzzle.desc,
                    fallbackPlacement: ['top'],
                    customClass: 'puzzle-card-popover',
                    boundary: 'viewport'
                }"
            />
        </b-container>
        <b-row id="puzzle-view-footer">
            <b-col></b-col>
            <b-col class="col-8" style="padding:0">
                <ProgressBar :value="playablePuzzleIndex" :max="roadmap.length" />
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
import { Action, Achievement } from '../store';

export default Vue.extend({
    data() {
        return {
            focusedPuzzleIndex: -1,
            playablePuzzleIndex: 0,
            playerName: 'PlayerOne',
        }
    },
    mounted() {
        this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP)
            .then(() => {
                this.setProgressFromRoadmap();
                this.updatePuzzleIndex();
                this.scrollToPuzzleIndex(this.playablePuzzleIndex);
            });
        this.scrollToPuzzleIndex(this.playablePuzzleIndex);
    },
    components: {
        ProgressBar,
        PuzzleCard,
    },
    computed: {
        loggedIn(): boolean {
            return this.$store.state.loggedIn;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
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

            const fraction = this.clamp(scroll.scrollLeft / (scroll.scrollWidth - 500), 0, this.roadmap.length);

            const oldIndex = this.$data.focusedPuzzleIndex;
            const newIndex = Math.floor(fraction * this.roadmap.length);

            // update
            if (oldIndex !== newIndex) {
                this.$data.focusedPuzzleIndex = newIndex;
            }
        },
        scrollToPuzzleIndex(index : number) {
            var scroll = document.getElementById('puzzle-scroll');
            if (scroll !== null) {
                scroll.scrollLeft = index * (scroll.scrollWidth / (this.roadmap.length + 2));
            }
        },
        play(id: number) {
            this.$router.push(`game/${id}`);
        },
        openChat() {
            console.log('open chat');
        },
        getAbsUrl(relUrl: string) {
            return process.env.APP_SERVER_URL + relUrl;
        },
        setProgressFromRoadmap() {
            this.$data.playablePuzzleIndex = 0;
            for (const [index, a] of this.roadmap.entries()) {
                if (a.level - 1 <= a.current_level && a.to_next < 1) {
                    this.$data.playablePuzzleIndex = index + a.to_next;
                    console.log('Level:', this.$data.playablePuzzleIndex);
                    break;
                }
            }
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
    scroll-behavior: smooth;
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

.puzzle-card-popover {
    background: black;
    font-size: 3vmin;
    max-width: 70vw;
}
</style>
