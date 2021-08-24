<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="puzzle-view-container">
        <b-row id="puzzle-view-header">
            <b-col>
                <b-img :src="logoSourcePng" />
            </b-col>
            <b-col style="display:flex;">
                <b v-if="lab_access" style="margin:auto auto 0 auto;font-size:4vw;text-transform:uppercase;">You did it!</b>
            </b-col>
            <b-col>
                <b-row v-if="loggedIn" style="justify-content:flex-end;margin-top:12px;">
                    <b-dropdown right variant="link" toggle-class="text-decoration-none puzzle-view-button" menu-class="puzzle-view-button" no-caret>
                        <template #button-content>
                            <b style="line-height:6vmin;margin-right:2vmin;vertical-align:bottom;">{{ username }}</b>
                            <div class="puzzle-view-icon-people" />
                        </template>
                        <b-dropdown-item @click="logout">Logout</b-dropdown-item>
                    </b-dropdown>
                </b-row>
                <b-row v-else style="justify-content:flex-end;margin-top:12px;">
                    <b-button class="puzzle-view-button" variant="primary" style="margin-right:3vmin" to="login">Log in</b-button>
                    <b-button class="puzzle-view-button" variant="secondary" to="register">Register</b-button>
                </b-row>
            </b-col>
        </b-row>
        <b-container id="puzzle-scroll">
            <div id="puzzle-card-wrapper">
                <div class="finish-card left-aligned" style="left:calc(-30vw - 2vmin);padding-right:10px;">
                    <!-- {{lab_title}} -->
                    <div>
                        <!-- {{ description }} -->
                        placeholdler
                    </div>
                </div>
                
                <LabPuzzleCard
                    v-for="(puzzle, index) in puzzles"
                    :key="index"
                    :title="puzzle.title"
                    :leftNum="puzzle.num_slots"
                    :numSynths="puzzle.num_synthesized"
                    :mySolutions="puzzle.num_solutions"
                    :maxSubmissions="puzzle.player_max_submissions"
                    :rightNum="puzzle.submitted"
                    :imgSrc="getPuzImg(puzzle.nid)"
                    @play="play(puzzle.nid)"
                    @review="review(puzzle.nid)"
                />
                <div class="finish-card" style="left:100%;" v-if="lab_access">
                    <div>
                        <p><strong>Now continue to<br/><a href="https://eternagame.org" target="_blank">eternagame.org</a><br/>to keep playing and<br/>join the OpenVaccine<br/>Challenge!</strong></p>
                        <p><b-button variant="primary" style="margin-top:10px;text-transform:uppercase;" href="https://eternagame.org">Let's go</b-button></p>
                    </div>
                </div>
            </div>
        </b-container>
        <b-row id="puzzle-view-footer">
            <b-col>
                <b-row style="justify-content:flex-start;align-items:flex-start;">
                    <router-link to="about">
                        <div class="puzzle-view-about-button" />
                    </router-link>
                </b-row>
            </b-col>
            <b-col class="col-8" style="padding:0">
                <div v-if="lab_access">
                    <ProgressBar :value="playablePuzzleIndex" :max="roadmap.length" />
                </div>
            </b-col>
            <b-col>
                <b-row style="justify-content:flex-end;align-items:flex-end;">
                    <div @click="openChat" class="puzzle-view-chat-button" />
                </b-row>
            </b-col>
        </b-row>
        <div id="chat-container" class="chat hidden"></div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ProgressBar from '../components/ProgressBar.vue'
import PuzzleCard from '../components/PuzzleCard.vue'
import LabPuzzleCard from '../components/LabPuzzleCard.vue'
import { Action, Achievement, LabViewData, LabData, PuzzleData } from '../store';
import ChatManager from '../ChatManager';

export default Vue.extend({
    data() {
        return {
            playablePuzzleIndex: 0,
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg').default,
        };
    },
    async mounted() {
        try {
            await this.$store.dispatch(Action.GET_LAB, {id: this.$route.params.id});
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
            this.chat = new ChatManager('chat-container', this.$store);
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        ProgressBar,
        PuzzleCard,
        LabPuzzleCard,
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        loggedIn(): boolean {
            return this.$store.state.loggedIn;
        },
        username(): string {
            return this.$store.state.username;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
        },
        lab_access(): boolean {
            return this.playablePuzzleIndex >= this.roadmap.length;
        },
        lab_title(): string{
            return this.$store.state.current_lab.lab.title;
        },
        description(): string{
            return this.$store.state.current_lab.lab.body;
        },
        puzzles(): PuzzleData {
            // loop through all rounds? or get first index
            return this.$store.state.current_lab.lab.puzzles[0].puzzles;
        }
    },
    methods: {
        async logout() {
            await this.$store.dispatch(Action.GET_LAB, {id: this.$route.params.id});
            await this.$store.dispatch(Action.LOGOUT);
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
        },
        clamp(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
        },
        play(id: number) {
            this.$router.replace(`/game/${id}`);
        },
        openChat() {
            if (this.chat) {
                this.chat.toggleVisibility();
            }
        },
        getAbsUrl(relUrl: string) {
            return process.env.APP_SERVER_URL + relUrl;
        },
        getPuzImg(nid: string | null){
            return (
            nid &&
            `https://renderv2-prod-renderv2bucket86ab868d-1aq5x6e32xf92.s3.amazonaws.com/puzzle_mid_thumbnails/thumbnail${nid}.svg`
            );
        },
        setProgressFromRoadmap() {
            this.playablePuzzleIndex = Number(this.roadmap[0].current_level);
            this.$forceUpdate();
        },
        scrollToPuzzleIndex(index : number) {
            var scroll = document.getElementById('puzzle-scroll');
            var wrapper = document.getElementById('puzzle-card-wrapper');
            if (scroll !== null && wrapper !== null) {
                scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
            }
        },
    }
});
</script>

<style lang="scss">
.loading-spinner {
    position: absolute;
    margin: auto;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
}

.puzzle-view-container {
    padding: 0;
    margin: 0;
    text-align: center;
    touch-action: none;
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
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-snap-type: x mandatory;
    padding-right: calc(50% - 22.5vmin);
    padding-left: calc(50% - 22.5vmin);
    margin-top: 0vmin;
    margin-bottom: 6vmin;
    max-width: unset;
}

#puzzle-scroll::-webkit-scrollbar {
    display: none;
}

#puzzle-view-footer {
    margin-left: 3vmin;
    margin-right: 3vmin;
}

#puzzle-card-wrapper {
    position: relative;
    display: inline-block;
    scroll-margin: 0 50vw;
}

.puzzle-card-container {
    transition: transform 0.2s;
}

.puzzle-view-button {
    font-size: 1.5vw;
}

.puzzle-view-chat-button {
    background: url('../assets/Chat.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 9vmin;
    height: 8vmin;
}
.puzzle-view-about-button {
    background: url('../assets/noun_info.svg');
    background-repeat: no-repeat;
    background-size: cover;
    border: none;
    width: 6vmin;
    height: 6vmin;
}

.puzzle-view-icon-people {
    background-image: url('../assets/DefaultIcon.svg');
    background-position: center top; /* Center the image */
    background-repeat: no-repeat; /* Do not repeat the image */
    background-size: cover; /* Resize the background image to cover the entire container */
    width: 6vmin;
    height: 6vmin;
    display: inline-block;
    vertical-align: middle;
}

.puzzle-card-popover {
    font-size: 1.5vw;
    max-width: 300px;
}

.finish-card {
    position: absolute;
    top: 0;
    display: inline-flex;
    width: 30vw;
    height: 45vmin;
    margin: 3vmin 1vmin 3vmin 1vmin;
    text-align: center;
    white-space: normal;
    vertical-align: middle;

    > div {
        margin: auto;

        p {
            font-size: 1.5vw;
        }
        strong {
            font-size: larger;
        }
    }
}

.left-aligned {
    text-align: left;
}

.chat {
    text-align: left;
    box-sizing: content-box;
    width: 230px;
    height: 340px;
    position: absolute;
    top: 140px;
    right: 10px;
    border: 1px solid rgba(47, 148, 209, 0.9);
    border-radius: 5px;
    -webkit-backdrop-filter: blur(3px);
    backdrop-filter: blur(3px);
    z-index: 1000;

    * {
        box-sizing: content-box;
    }
    button, img {
        padding: 0;
    }
}

@media (max-height: 510px) {
    .chat {
        width: 30%;
        min-width: 230px;
        height: 85%;
        top: 5px;
        right: 5px;
    }
}
.hidden{
  opacity: 0;
}
</style>
