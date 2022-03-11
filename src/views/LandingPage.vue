<template>
    <div v-if="isLoading">
        <b-spinner class="loading-spinner" />
    </div>
    <div v-else class="puzzle-view-container">
        <HeaderBar></HeaderBar>
        <div class="content" v-if="lab_access">
            <Carousel />
        </div>
        <div class="content" v-else>
            <div class="left-block ">
                <div>
                    <p><strong>Welcome to Eterna, a game where you design RNAs for research by solving puzzles.</strong></p>
                    <p>Complete these puzzles to unlock access to advanced lab challenges.</p>
                    <p><strong>Ready?</strong></p>
                </div>
            </div>
             <b-container id="puzzle-scroll">
                <div id="puzzle-card-wrapper">
                <TutorialCard
                    v-for="(puzzle, index) in roadmap"
                    :key="index"
                    :highlight="index === Math.floor(playablePuzzleIndex)"
                    :imgSrc="getAbsUrl(puzzle.image)"
                    @play="play(puzzle.current_puzzle)"
                    :state="puzzle.to_next >= 1 ? 'completed' : (puzzle.level - 1) > puzzle.current_level ? 'locked' : 'unlocked'"
                    v-b-popover.click.blur.top.html="{
                        content: puzzle.desc,
                        fallbackPlacement: ['top'],
                        customClass: 'puzzle-card-popover',
                        boundary: 'viewport'
                    }"
                />
                <TutorialCard
                    key="lab"
                    :highlight="lab_access"
                    :imgSrc="getAbsUrl('/puzzle-progression/badges/badge_lab_unlocked.png')"
                    :state="lab_access ? 'completed' : 'locked'"
                />
                <div class="finish-card" style="left:100%;" v-if="lab_access">
                    <div>
                        <p><strong>Now continue to<br/><a href="https://eternagame.org" target="_blank">eternagame.org</a><br/>to keep playing and<br/>join the lab!</strong></p>
                        <p><b-button variant="primary" style="margin-top:10px;text-transform:uppercase;" href="https://eternagame.org">Let's go</b-button></p>
                    </div>
                </div>
            </div>
        </b-container>
        </div>
        <b-row id="puzzle-view-footer">
            <b-col>
                <b-row style="justify-content:flex-start;align-items:flex-start;">
                    <router-link to="about">
                        <div class="puzzle-view-about-button" />
                    </router-link>
                </b-row>
            </b-col>
            <b-col class="col-8" style="padding:0" v-if="!lab_access">
                <div>
                    <ProgressBar :value="playablePuzzleIndex" :max="roadmap.length" />
                </div>
            </b-col>
            <b-col class="col-8" style="padding:0" v-if="lab_access">
                <NavBar/>
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
import Carousel from '../components/Carousel.vue'
import HeaderBar from '../components/HeaderBar.vue'
import NavBar from '../components/NavBar.vue'
import ProgressBar from '../components/ProgressBar.vue'
import TutorialCard from '../components/TutorialCard.vue'

import { Action, Achievement } from '../store';
import ChatManager from '../ChatManager';


export default Vue.extend({
    data() {
        return {
            playablePuzzleIndex: 0,
            chat: <ChatManager | null>null,
            logoSourcePng: require('../assets/logo_eterna.svg'),
        };
    },
    async mounted() {
        try {
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            await this.$store.dispatch(Action.GET_PUZZLES);
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
            this.chat = new ChatManager('chat-container', this.$store);
        } catch (error) {
            console.error(error);
        }
    },
    components: {
        Carousel,
        HeaderBar,
        NavBar,
        ProgressBar,
        TutorialCard,
    },
    computed: {
        isLoading(): boolean {
            return this.$store.getters.isLoading;
        },
        roadmap(): Achievement[] {
            return this.$store.state.roadmap;
        },
        lab_access(): boolean {
            return this.playablePuzzleIndex >= this.roadmap.length;
        }
    },
    methods: {
        async logout() {
            await this.$store.dispatch(Action.LOGOUT);
            await this.$store.dispatch(Action.GET_ACHIEVEMENT_ROADMAP);
            this.setProgressFromRoadmap();
            this.scrollToPuzzleIndex(this.playablePuzzleIndex);
        },
        clamp(x: number, min: number, max: number) {
            return Math.max(min, Math.min(max, x));
        },
        play(id: number) {
            this.$router.push(`game/${id}`);
        },
        openChat() {
            if (this.chat) {
                this.chat.toggleVisibility();
            }
        },
        getAbsUrl(relUrl: string) {
            return process.env.APP_SERVER_URL + relUrl;
        },
        setProgressFromRoadmap() {
            this.playablePuzzleIndex = Number(this.roadmap[0].current_level);
            this.$forceUpdate();
        },
        scrollToPuzzleIndex(index : number) {
            var scroll = document.getElementById('puzzle-scroll');
            var wrapper = document.getElementById('puzzle-card-wrapper');
            if (scroll !== null && wrapper !== null) {
                // scroll.scrollLeft = Math.floor(index) * (wrapper.clientWidth / (this.roadmap.length + 1));
            }
        },
    }
});
</script>

<style lang="scss" scoped>
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
    height: 18vh !important;
    margin-bottom: 15px;
    padding-top: 0 !important;
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
    padding-left: 25px;
    margin-top: 0vmin;
    max-width: unset;
}

#puzzle-scroll::-webkit-scrollbar {
    display: none;
}


#puzzle-view-footer {
    height: 18vh !important;
    display: flex;
    align-items: center;
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
.header-logo {
    max-width: 100%;
    height: 100%;
}
</style>
